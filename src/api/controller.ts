import type { CookieSerializeOptions } from '@fastify/cookie'
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { ControllerContext } from './context.js'
import type {
    ControllerSchema,
    HTTPMethods,
    RouteOptions,
    Server,
} from './server.js'
import { CONTEXT, GITHUB_AUTH_NS, Status } from './constants.js'

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

export interface ResponseType<
    Schema extends ControllerSchema = never,
    TStatus = never,
> {
    // @ts-expect-error - We're sure that it's a valid key
    body?: GetStatic<Schema['response'], TStatus>
    cookies?: Cookies
    headers?: Headers
    redirect?: string
    status: TStatus
}

export type Controller<
    TSchema extends ControllerSchema = never,
    TStatus extends keyof TSchema['response'] = keyof TSchema['response'],
> = (
    params: Readonly<
        {
            S: typeof Status
            body: Readonly<GetStatic<TSchema, 'body'>>
            headers: Readonly<GetStatic<TSchema, 'headers'>>
            params: Readonly<GetStatic<TSchema, 'params'>>
            query: Readonly<GetStatic<TSchema, 'querystring'>>
        } & {
            ctx: ControllerContext
        }
    >,
) => Promise<ResponseType<TSchema, TStatus>> | ResponseType<TSchema, TStatus>

export function createResponse<
    TSchema extends ControllerSchema = never,
    TStatus extends keyof TSchema['response'] = keyof TSchema['response'],
>(
    status: TStatus,
    params: {
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
        headers: params.headers,
        redirect: params.redirect,
        status,
    } as ResponseType<TSchema, TStatus>
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
    schema: (S: typeof Status, T: typeof Type) => TSchema,
): TSchema {
    return schema(Status, Type)
}

export function createController<TSchema extends ControllerSchema>(
    server: Server,
    method: HTTPMethods,
    url: string,
    schema: TSchema,
    controller: Controller<TSchema>,
): RouteOptions {
    return {
        handler: async (request, response) => {
            const { body, cookies, headers, redirect, status } =
                await controller({
                    S: Status,
                    body: request.body as never,
                    ctx: {
                        auth: {
                            github: server[GITHUB_AUTH_NS],
                        },
                        config: server[CONTEXT].config,
                        db: server[CONTEXT].db,
                        logger: server[CONTEXT].logger,
                        redirect: createRedirect,
                        request,
                        response: createResponse,
                        server,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                        user: (request as any).user,
                    },
                    headers: request.headers as never,
                    params: request.params as never,
                    query: request.query as never,
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
