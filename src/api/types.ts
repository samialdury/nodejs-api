/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-style */
import type { BaseContext } from '@apollo/server'
import type { OAuth2Namespace } from '@fastify/oauth2'
import type { Static } from '@fastify/type-provider-typebox'
import type {
    FastifyInstance,
    FastifySchema,
    FastifyRequest,
    FastifyReply,
    FastifyPluginAsync,
    RouteOptions,
    HTTPMethods,
} from 'fastify'

import { Status } from './constants.js'

export type Server = FastifyInstance
export type ServerPlugin = FastifyPluginAsync
export type ServerRequest = FastifyRequest
export type ServerResponse = FastifyReply
export type ControllerSchema = FastifySchema

export interface GraphQLContext extends BaseContext {
    dummy?: string
}

type Unwrap<T> = T[keyof T]

// @ts-expect-error it's fine
type GetStatic<S extends FastifySchema, T extends keyof S> = Static<S[T]>

interface RequestContext {
    server: Server
    request: ServerRequest
    auth: {
        github: OAuth2Namespace
    }
}

export type Controller<Schema extends FastifySchema = never> = (
    params: Readonly<
        {
            body: Readonly<GetStatic<Schema, 'body'>>
            params: Readonly<GetStatic<Schema, 'params'>>
            query: Readonly<GetStatic<Schema, 'querystring'>>
            headers: Readonly<GetStatic<Schema, 'headers'>>
        } & {
            context: RequestContext
        }
    >,
) =>
    | {
          status: Status
          body?: Static<Unwrap<Schema['response']>>
      }
    | Promise<{
          status: Status
          body?: Static<Unwrap<Schema['response']>>
      }>

export const createController = <S extends FastifySchema>(
    server: Server,
    method: HTTPMethods,
    url: `/${string}`,
    schema: S,
    controller: Controller<S>,
): RouteOptions => {
    return {
        method,
        url,
        schema,
        handler: async (request, response) => {
            const { status, body } = await controller({
                context: {
                    server,
                    request,
                    auth: {
                        // @ts-expect-error it's fine
                        github: server.githubOAuth2,
                    },
                },
                body: request.body as never,
                params: request.params as never,
                query: request.query as never,
                headers: request.headers as never,
            })

            if (status === Status.NO_CONTENT) {
                return response.status(status).send()
            }

            return response.status(status).send(body)
        },
    }
}
