import type { FastifySchemaValidationError } from 'fastify/types/schema.js'
import type {
    Server,
    ServerError,
    ServerRequest,
    ServerResponse,
} from '../server.js'
import { Reason, Status } from '../constants.js'
import { HttpError, type HttpErrorObject } from './http-errors.js'

export async function errorHandler(
    server: Server,
    err: ServerError,
    _request: ServerRequest,
    response: ServerResponse,
): Promise<void> {
    if (err instanceof HttpError) {
        const errObject = err.toObject(server.ctx.config.debugMode)

        return response.status(errObject.statusCode).send(errObject)
    }

    if (err.validation) {
        return response.status(Status.BAD_REQUEST).send({
            statusCode: Status.BAD_REQUEST,
            type: Reason.BAD_REQUEST,
            code: 'validation',
            message: err.message,
            errors: err.validation,
        } satisfies HttpErrorObject & {
            errors: FastifySchemaValidationError[]
        })
    }

    // Workaround for `@fastify/bearer-auth`
    switch (err.message) {
        case 'missing authorization header': {
            return response.status(Status.UNAUTHORIZED).send({
                statusCode: Status.UNAUTHORIZED,
                type: Reason.UNAUTHORIZED,
                code: 'missing-auth-header',
                message: 'Missing authorization header',
            } satisfies HttpErrorObject)
        }
        case 'invalid authorization header': {
            return response.status(Status.UNAUTHORIZED).send({
                statusCode: Status.UNAUTHORIZED,
                type: Reason.UNAUTHORIZED,
                code: 'invalid-access-token',
                message: 'Invalid access token',
            } satisfies HttpErrorObject)
        }
    }

    server.ctx.logger.error(err, 'Unhandled error')

    return response.status(Status.INTERNAL_SERVER_ERROR).send({
        statusCode: Status.INTERNAL_SERVER_ERROR,
        type: Reason.INTERNAL_SERVER_ERROR,
        code: 'internal',
        message: 'Something went wrong',
        ...(server.ctx.config.debugMode && {
            causedBy: HttpError.createCauseObject(err),
            stack: err.stack,
        }),
    } satisfies HttpErrorObject)
}
