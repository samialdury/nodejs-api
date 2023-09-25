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

    request.log.error(err, 'Unhandled error')

    return response.status(Status.INTERNAL_SERVER_ERROR).send({
        code: 'internal',
        message: 'Something went wrong',
        statusCode: Status.INTERNAL_SERVER_ERROR,
        type: Reason.INTERNAL_SERVER_ERROR,
    } satisfies HttpErrorSerialized)
}
