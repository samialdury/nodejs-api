import type { Context } from '../../api/context.js'
import type { ServerRequest, ServerResponse } from '../../api/server.js'
import { UnauthorizedError } from '../../api/errors/http-errors.js'
import { userService } from '../user/service.js'

async function verifyUserJwt(
    ctx: Context,
    token: string,
    request: ServerRequest,
): Promise<void> {
    try {
        const decoded = await userService.decodeJwt(ctx, token)

        // @ts-expect-error it's fine
        request.user = decoded
    } catch {
        throw new UnauthorizedError(
            'Invalid access token',
            'invalid-access-token',
        )
    }
}

async function verifyUserJwtFromCookie(
    ctx: Context,
    request: ServerRequest,
    _response: ServerResponse,
): Promise<void> {
    const rawToken = request.cookies['accessToken']

    if (!rawToken) {
        throw new UnauthorizedError('No access token', 'missing-access-token')
    }

    const token = request.unsignCookie(rawToken)

    if (!token.valid) {
        ctx.logger.warn(
            {
                token: rawToken,
            },
            'Invalid cookie signature',
        )

        throw new UnauthorizedError(
            'Invalid access token',
            'invalid-access-token',
        )
    }

    if (!token.value) {
        ctx.logger.warn(
            {
                token: rawToken,
            },
            'Empty access token',
        )

        throw new UnauthorizedError(
            'Invalid access token',
            'invalid-access-token',
        )
    }

    await verifyUserJwt(ctx, token.value, request)
}

export const authMiddleware = {
    verifyUserJwt,
    verifyUserJwtFromCookie,
}
