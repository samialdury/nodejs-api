import type { ServerError, ServerRequest, ServerResponse } from '../server.js'
import { Reason, Status } from '../constants.js'
import { HttpError, type HttpErrorSerialized } from './http-errors.js'

export async function errorHandler(
    err: ServerError,
    request: ServerRequest,
    response: ServerResponse,
): Promise<void> {
    if (err instanceof HttpError) {
        const serialized = err.serialize()

        return response.status(serialized.statusCode).send(serialized)
    }

    // Workaround for `@fastify/bearer-auth`
    switch (err.message) {
        case 'missing authorization header': {
            return response.status(Status.UNAUTHORIZED).send({
                code: 'missing-auth-header',
                message: 'Missing authorization header',
                statusCode: Status.UNAUTHORIZED,
                type: Reason.UNAUTHORIZED,
            } satisfies HttpErrorSerialized)
        }
        case 'invalid authorization header': {
            return response.status(Status.UNAUTHORIZED).send({
                code: 'invalid-access-token',
                message: 'Invalid access token',
                statusCode: Status.UNAUTHORIZED,
                type: Reason.UNAUTHORIZED,
            } satisfies HttpErrorSerialized)
        }
    }

    request.log.error(err, 'Unhandled error')

    return response.status(Status.INTERNAL_SERVER_ERROR).send({
        code: 'internal',
        message: 'Something went wrong',
        statusCode: Status.INTERNAL_SERVER_ERROR,
        type: Reason.INTERNAL_SERVER_ERROR,
    } satisfies HttpErrorSerialized)
}
