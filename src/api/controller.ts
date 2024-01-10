import type { CookieSerializeOptions } from '@fastify/cookie'
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { Prettify } from '../types/util.js'
import type { ControllerContext } from './context.js'
import type {
    ControllerSchema,
    HTTPMethods,
    RouteOptions,
    Server,
} from './server.js'
import { Status } from './constants.js'
import { httpErrorSchema, validationErrorSchema } from './errors/http-errors.js'

// @ts-expect-error - We're sure that it's a valid key
type GetStatic<S, K extends keyof S> = Static<S[K]>

export type Cookies = Record<
    string,
    {
        options?: CookieSerializeOptions
        value: string
    }
>

export type Headers = Record<string, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseGenericContext = Record<string, any>

export interface ResponseType<
    Schema extends ControllerSchema = never,
    TStatus = never,
> {
    // @ts-expect-error - We're sure that it's a valid key
    body?: GetStatic<Schema['response'], TStatus>
    cookies?: Cookies
    clearCookies?: string[]
    headers?: Headers
    redirect?: string
    status: TStatus
}

export type Controller<
    TContext extends BaseGenericContext,
    TSchema extends ControllerSchema = never,
    TStatus extends keyof TSchema['response'] = keyof TSchema['response'],
> = (
    params: Readonly<
        {
            body: Readonly<GetStatic<TSchema, 'body'>>
            headers: Readonly<GetStatic<TSchema, 'headers'>>
            params: Readonly<GetStatic<TSchema, 'params'>>
            query: Readonly<GetStatic<TSchema, 'querystring'>>
            s: typeof Status
        } & {
            ctx: Prettify<ControllerContext & TContext>
        }
    >,
) => Promise<ResponseType<TSchema, TStatus>> | ResponseType<TSchema, TStatus>

export function createResponse<
    TSchema extends ControllerSchema = never,
    TStatus extends keyof TSchema['response'] = keyof TSchema['response'],
>(
    status: TStatus,
    params: {
        clearCookies?: string[]
        cookies?: Cookies
        headers?: Headers
        redirect?: string
    } & (TStatus extends Status.NO_CONTENT
        ? { body?: never }
        : { body: GetStatic<TSchema['response'], TStatus> }),
): ResponseType<TSchema, TStatus> {
    return {
        body: params.body,
        cookies: params.cookies,
        clearCookies: params.clearCookies,
        headers: params.headers,
        redirect: params.redirect,
        status,
    } as ResponseType<TSchema, TStatus>
}

export interface RouteDefinition<
    TContext extends BaseGenericContext,
    TSchema extends ControllerSchema,
> {
    controller: Controller<TContext, TSchema>
    schema: TSchema
}

export function createRedirect(params: {
    cookies?: Cookies
    location: string
}): ResponseType {
    return {
        cookies: params.cookies,
        redirect: params.location,
    } as ResponseType
}

export function createSchema<TSchema extends ControllerSchema>(
    schema: (s: typeof Status, t: typeof Type) => TSchema,
    {
        withAuthorization = true,
        withInternal = true,
    }: {
        withAuthorization?: boolean
        withInternal?: boolean
    } = {},
): TSchema {
    const result = schema(Status, Type)

    const hasValidation = !!(
        result.params ??
        result.querystring ??
        result.body ??
        result.headers
    )

    return {
        ...result,
        response: {
            ...(hasValidation && {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [Status.BAD_REQUEST]: Type.Ref(validationErrorSchema.$id!, {
                    title: 'Validation error',
                    description: 'Error in request validation',
                }),
            }),
            ...(withAuthorization && {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [Status.UNAUTHORIZED]: Type.Ref(httpErrorSchema.$id!, {
                    title: 'Unauthorized',
                    description: 'Missing or invalid access token',
                }),
            }),
            ...(withInternal && {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [Status.INTERNAL_SERVER_ERROR]: Type.Ref(httpErrorSchema.$id!, {
                    title: 'Internal server error',
                    description: 'Unknown server error',
                }),
            }),
            ...(result.response as Record<string, unknown> | undefined),
        },
    }
}

export function createController<
    TContext extends BaseGenericContext,
    TSchema extends ControllerSchema,
>(
    server: Server,
    method: HTTPMethods,
    url: string,
    {
        schema,
        controller,
    }: RouteDefinition<ControllerContext & TContext, TSchema>,
): RouteOptions {
    return {
        handler: async (request, response) => {
            const { body, cookies, clearCookies, headers, redirect, status } =
                await controller({
                    s: Status,
                    body: request.body as never,
                    headers: request.headers as never,
                    params: request.params as never,
                    query: request.query as never,
                    ctx: {
                        request,
                        server,
                        redirect: createRedirect,
                        response: createResponse,
                        auth: {
                            github: server.githubOAuth2,
                        },
                        ...server.ctx,
                        ...server.scopedCtx,
                    } as ControllerContext & TContext,
                })

            if (cookies) {
                for (const [name, { options, value }] of Object.entries(
                    cookies,
                )) {
                    void response.setCookie(name, value, {
                        httpOnly: true,
                        path: '/',
                        sameSite: 'lax',
                        secure: true,
                        signed: true,
                        ...options,
                    })
                }
            }

            if (clearCookies) {
                for (const name of clearCookies) {
                    void response.clearCookie(name)
                }
            }

            if (headers) {
                void response.headers(headers)
            }

            if (redirect) {
                return response.redirect(redirect)
            }

            if (status === Status.NO_CONTENT) {
                return response.status(status).send()
            }

            return response.status(status as number).send(body)
        },
        method,
        schema,
        url,
    } as RouteOptions
}
