/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FastifySchema, HTTPMethods, RouteOptions } from 'fastify'
import type { Controller, Server } from './types.js'
import { Status } from './constants.js'

export const createController = <S extends FastifySchema>(
    server: Server,
    method: HTTPMethods,
    url: string,
    schema: S,
    controller: Controller<S>,
): RouteOptions => {
    return {
        handler: async (request, response) => {
            const { body, status } = await controller({
                body: request.body as never,
                context: {
                    auth: {
                        // @ts-expect-error it's fine
                        github: server.githubOAuth2,
                    },
                    request,
                    server,
                },
                headers: request.headers as never,
                params: request.params as never,
                query: request.query as never,
            })

            if (status === Status.NO_CONTENT) {
                return response.status(status).send()
            }

            return response.status(status).send(body)
        },
        method,
        schema,
        url,
    }
}
