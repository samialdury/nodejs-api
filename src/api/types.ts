import type { BaseContext } from '@apollo/server'
import type { OAuth2Namespace } from '@fastify/oauth2'
import type { Static } from '@fastify/type-provider-typebox'
import type {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
    FastifySchema,
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
    auth: {
        github: OAuth2Namespace
    }
    request: ServerRequest
    server: Server
}

export type Controller<Schema extends FastifySchema = never> = (
    params: Readonly<
        {
            body: Readonly<GetStatic<Schema, 'body'>>
            headers: Readonly<GetStatic<Schema, 'headers'>>
            params: Readonly<GetStatic<Schema, 'params'>>
            query: Readonly<GetStatic<Schema, 'querystring'>>
        } & {
            context: ControllerContext
        }
    >,
) =>
    | {
          // @ts-expect-error it's fine
          body?: Static<Unwrap<Schema['response']>>
          status: Status
      }
    | Promise<{
          // @ts-expect-error it's fine
          body?: Static<Unwrap<Schema['response']>>
          status: Status
      }>
