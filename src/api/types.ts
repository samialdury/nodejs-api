import type { BaseContext } from '@apollo/server'
import type { OAuth2Namespace } from '@fastify/oauth2'
import type { Static } from '@fastify/type-provider-typebox'
import type {
    FastifyInstance,
    FastifySchema,
    FastifyRequest,
    FastifyReply,
    FastifyPluginAsync,
} from 'fastify'

import type { Status } from './constants.js'

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

export interface ControllerContext {
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
            context: ControllerContext
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
