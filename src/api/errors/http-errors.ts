import { Reason, Status } from '../../api/constants.js'
import { BaseError } from '../../errors/base-error.js'

export interface HttpErrorSerialized {
    code: string
    message: string
    statusCode: Status
    type: Reason
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

    public serialize(): HttpErrorSerialized {
        return {
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            type: this.reasonPhrase,
        }
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.BAD_REQUEST, Status.BAD_REQUEST)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.UNAUTHORIZED, Status.UNAUTHORIZED)
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.FORBIDDEN, Status.FORBIDDEN)
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.NOT_FOUND, Status.NOT_FOUND)
    }
}

export class InternalServerError extends HttpError {
    constructor(message: string, code: string) {
        super(
            message,
            code,
            Reason.INTERNAL_SERVER_ERROR,
            Status.INTERNAL_SERVER_ERROR,
        )
    }
}

export class ConflictError extends HttpError {
    constructor(message: string, code: string) {
        super(message, code, Reason.CONFLICT, Status.CONFLICT)
    }
}
