import { Type } from '@sinclair/typebox'
import { Reason, Status } from '../../api/constants.js'
import { BaseError } from '../../errors/base-error.js'

export const httpErrorSchema = Type.Object(
    {
        statusCode: Type.Integer({
            description: 'HTTP status code',
        }),
        type: Type.String({
            description: 'HTTP reason phrase',
        }),
        code: Type.String({
            description: 'Internal error code',
        }),
        message: Type.String({
            description: 'Description of the error',
        }),
    },
    {
        $id: 'http-error',
        title: 'Error',
    },
)

export const validationErrorSchema = Type.Object(
    {
        statusCode: Type.Literal(Status.BAD_REQUEST, {
            description: 'HTTP status code',
        }),
        type: Type.Literal(Reason.BAD_REQUEST, {
            description: 'HTTP reason phrase',
        }),
        code: Type.Literal('validation', {
            description: 'Internal error code',
        }),
        message: Type.String({
            description: 'Description of the error',
        }),
        errors: Type.Array(
            Type.Object({
                keyword: Type.String(),
                instancePath: Type.String(),
                schemaPath: Type.String(),
                params: Type.Object({}, { additionalProperties: true }),
                message: Type.Optional(Type.String()),
            }),
        ),
    },
    {
        $id: 'validation-error',
        title: 'Validation error',
    },
)

export interface HttpErrorObject {
    code: string
    message: string
    statusCode: Status
    type: Reason
    stack?: string
    causedBy?: unknown
}

export class HttpError extends BaseError {
    public code: string
    public reasonPhrase: Reason
    public statusCode: Status

    constructor(
        message: string,
        code: string,
        reasonPhrase: Reason,
        statusCode: Status,
    ) {
        super(message, true)
        this.code = code
        this.reasonPhrase = reasonPhrase
        this.statusCode = statusCode
    }

    public static createCauseObject(cause: unknown): unknown {
        if (!cause) {
            return undefined
        }

        if (cause instanceof Error) {
            return {
                name: cause.name,
                message: cause.message,
                causedBy: cause.cause
                    ? this.createCauseObject(cause.cause)
                    : undefined,
            }
        }

        if (
            typeof cause === 'string' ||
            typeof cause === 'number' ||
            typeof cause === 'boolean'
        ) {
            return cause
        }

        if (Array.isArray(cause)) {
            return cause.map((item) => this.createCauseObject(item))
        }

        if (typeof cause === 'object') {
            return Object.fromEntries(
                Object.entries(cause).map(([key, value]) => [
                    key,
                    this.createCauseObject(value),
                ]),
            )
        }

        return JSON.stringify(cause, undefined, 2)
    }

    public toObject(includeSensitive = false): HttpErrorObject {
        return {
            statusCode: this.statusCode,
            type: this.reasonPhrase,
            code: this.code,
            message: this.message,
            ...(includeSensitive && {
                causedBy: HttpError.createCauseObject(this.cause),
                stack: this.stack,
            }),
        }
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.BAD_REQUEST, Status.BAD_REQUEST)
        this.name = this.constructor.name
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.UNAUTHORIZED, Status.UNAUTHORIZED)
        this.name = this.constructor.name
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.FORBIDDEN, Status.FORBIDDEN)
        this.name = this.constructor.name
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.NOT_FOUND, Status.NOT_FOUND)
        this.name = this.constructor.name
    }
}

export class InternalServerError extends HttpError {
    constructor(message: string, code: string, cause: unknown) {
        super(
            message,
            code,
            Reason.INTERNAL_SERVER_ERROR,
            Status.INTERNAL_SERVER_ERROR,
        )
        this.name = this.constructor.name
        this.cause = cause
    }
}

export class ConflictError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.CONFLICT, Status.CONFLICT)
        this.name = this.constructor.name
    }
}
