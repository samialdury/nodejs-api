/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FastifySchema, HTTPMethods, RouteOptions } from 'fastify'

import { Status } from './constants.js'
import type { Controller, Server } from './types.js'

export const createController = <S extends FastifySchema>(
    server: Server,
    method: HTTPMethods,
    url: string,
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
