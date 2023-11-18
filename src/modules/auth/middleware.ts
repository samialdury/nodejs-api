import type { ServerRequest } from '../../api/server.js'
import type { Config } from '../../config.js'
import type { UserJwt } from '../user/jwt.js'
import { UnauthorizedError } from '../../api/errors/http-errors.js'
import { decodeJwt } from './jwt/service.js'

export async function verifyUserJwt(
    config: Config,
    token: string,
    request: ServerRequest,
): Promise<void> {
    try {
        const decoded = await decodeJwt<UserJwt>(config, {
            token,
        })

        request.user = decoded
    } catch {
        throw new UnauthorizedError(
            'Invalid access token',
            'invalid-access-token',
        )
    }
}
