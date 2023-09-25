/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CookieSerializeOptions } from '@fastify/cookie'
import type { FastifySchema, HTTPMethods, RouteOptions } from 'fastify'
import type { ControllerContext } from './context.js'
import type { ControllerSchema, Server } from './server.js'
import { CONTEXT, GITHUB_AUTH_NS, Status } from './constants.js'

// @ts-expect-error - We're sure that it's a valid key
type GetStatic<S extends ControllerSchema, T extends keyof S> = Static<S[T]>

export type Cookies = Record<
    string,
    {
        options?: CookieSerializeOptions
        value: string
    }
>

export interface ResponseType<Schema extends ControllerSchema, TStatus> {
    // @ts-expect-error - We're sure that it's a valid key
    body?: Static<PropertyType<Schema['response'], TStatus>>
    cookies?: Cookies
    redirect?: string
    status: TStatus
}

export type Controller<
    Schema extends ControllerSchema = never,
    TStatus extends keyof Schema['response'] = keyof Schema['response'],
> = (
    params: Readonly<
        {
            body: Readonly<GetStatic<Schema, 'body'>>
            headers: Readonly<GetStatic<Schema, 'headers'>>
            params: Readonly<GetStatic<Schema, 'params'>>
            query: Readonly<GetStatic<Schema, 'querystring'>>
        } & {
            ctx: ControllerContext
        }
    >,
) => Promise<ResponseType<Schema, TStatus>> | ResponseType<Schema, TStatus>

export function createResponse<
    Schema extends FastifySchema,
    TStatus extends keyof Schema['response'],
>(
    status: TStatus,
    params: {
        cookies?: Cookies
        redirect?: string
    } & (TStatus extends Status.NO_CONTENT
        ? { body?: never }
        : // @ts-expect-error
          { body: Static<PropertyType<Schema['response'], TStatus>> }),
): ResponseType<Schema, TStatus> {
    return {
        body: params.body,
        cookies: params.cookies,
        redirect: params.redirect,
        status,
    } as ResponseType<Schema, TStatus>
}

export function createRedirect(params: {
    cookies?: Cookies
    location: string
}): ResponseType<never, never> {
    return {
        cookies: params.cookies,
        redirect: params.location,
    } as ResponseType<never, never>
}

export const createController = <S extends FastifySchema>(
    server: Server,
    method: HTTPMethods,
    url: string,
    schema: S,
    controller: Controller<S>,
): RouteOptions => {
    return {
        handler: async (request, response) => {
            const { body, cookies, redirect, status } = await controller({
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
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
    }
}
