/* eslint-disable func-style */
import type {
    TypeBoxTypeProvider,
    FastifyPluginAsyncTypebox,
    Static,
} from '@fastify/type-provider-typebox'
import type {
    FastifyInstance,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    FastifySchema,
    FastifyRequest,
    RouteGenericInterface,
    FastifyReply,
    ContextConfigDefault,
    FastifyPluginAsync,
    RouteOptions,
    HTTPMethods,
} from 'fastify'

import type { Logger } from '../logger.js'

import { Status } from './constants.js'
import { T } from './validation.js'
import { isAsyncFunction } from 'util/types'

export type APIServer = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    Logger,
    TypeBoxTypeProvider
>

export type HandlerSchema = FastifySchema

export type ControllerSchema = FastifySchema

export type ServerPluginRaw = FastifyPluginAsync
export type ServerPlugin = FastifyPluginAsyncTypebox

export type Request<TSchema extends HandlerSchema> = FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    TSchema,
    TypeBoxTypeProvider
>

export type Response<TSchema extends HandlerSchema> = FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGenericInterface,
    ContextConfigDefault,
    TSchema,
    TypeBoxTypeProvider
>

export type Handler<TSchema extends HandlerSchema> = (
    request: Request<TSchema>,
    response: Response<TSchema>,
) => Promise<
    FastifyReply<
        RawServerDefault,
        RawRequestDefaultExpression,
        RawReplyDefaultExpression,
        RouteGenericInterface,
        ContextConfigDefault,
        TSchema,
        TypeBoxTypeProvider
    >
>

export type PreHandler<TSchema extends HandlerSchema> = (
    request: Request<TSchema>,
    response: Response<TSchema>,
) => Promise<void>

// export interface Controller<S extends HandlerSchema> {
//     method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
//     url: `/${string}`
//     schema: HandlerSchema
//     handler: Handler<S>
// }

type Unwrap<T> = T[keyof T]

// @ts-expect-error idc it works
type GetStatic<S extends FastifySchema, T extends keyof S> = Static<S[T]>

export type Controller<Schema extends FastifySchema> = (
    params: Readonly<
        {
            body: Readonly<GetStatic<Schema, 'body'>>
            params: Readonly<GetStatic<Schema, 'params'>>
            query: Readonly<GetStatic<Schema, 'querystring'>>
            headers: Readonly<GetStatic<Schema, 'headers'>>
        } & {
            context: { server: FastifyInstance }
        }
    >,
) =>
    | {
          status: Status
          body: Static<Unwrap<Schema['response']>>
      }
    | Promise<{
          status: Status
          body: Static<Unwrap<Schema['response']>>
      }>

const schema = {
    body: T.Object({
        name: T.String({ minLength: 2, maxLength: 50 }),
        email: T.String({ format: 'email' }),
    }),
    headers: T.Object({
        authorization: T.String({ minLength: 2, maxLength: 50 }),
    }),
    querystring: T.Object({
        lastName: T.String({ minLength: 2, maxLength: 50 }),
    }),
    params: T.Object({
        oid: T.String({ minLength: 2, maxLength: 50 }),
    }),
    response: {
        [Status.CREATED]: T.Object({
            id: T.String({ minLength: 16, maxLength: 16 }),
            name: T.String({ minLength: 2, maxLength: 50 }),
            email: T.String({ format: 'email' }),
        }),
    },
} satisfies FastifySchema

export const controller: Controller<typeof schema> = ({
    body,
    params,
    headers,
    query,
}) => {
    return {
        status: Status.OK,
        body: {
            email: 'hello',
            name: body.name,
            id: '1234567890abcdef',
        },
    }
}

export const createController = (
    {
        method,
        url,
    }: {
        method: HTTPMethods
        url: `/${string}`
    },
    server: FastifyInstance,
    controller: Controller<any>,
): RouteOptions => {
    return {
        method,
        url,
        schema,
        handler: async (request, response) => {
            const { status, body } = await controller({
                context: {
                    server,
                },
                body: request.body,
                params: request.params,
                query: request.query,
                headers: request.headers,
            })

            return response.status(status).send(body)
        },
    }
}
