import type { RouteOptions } from 'fastify'

import { Status } from '../../../../api/constants.js'
import type { Handler, HandlerSchema } from '../../../../api/types.js'
import { T } from '../../../../api/validation.js'

const schema = {
    body: T.Object({
        name: T.String({ minLength: 2, maxLength: 50 }),
        email: T.String({ format: 'email' }),
    }),
    response: {
        [Status.CREATED]: T.Object({
            id: T.String({ minLength: 16, maxLength: 16 }),
            name: T.String({ minLength: 2, maxLength: 50 }),
            email: T.String({ format: 'email' }),
        }),
    },
} satisfies HandlerSchema

const handler: Handler<typeof schema> =
    (server) => async (request, response) => {
        return response.status(Status.CREATED).send({
            id: '1234567890abcdef',
            name: 'John Doe',
            email: 'john@doe.com',
        })
    }

export const route: RouteOptions = {
    method: 'POST',
    url: '/auth/github/callback',
    schema,
    handler: ,
}
