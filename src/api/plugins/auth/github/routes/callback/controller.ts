import { logger } from '../../../../../../logger.js'
import { encodeJWT } from '../../../../../../modules/auth/service/jwt.js'
import { Status } from '../../../../../constants.js'
import type { Controller } from '../../../../../types.js'
import { getGithubUserInfo } from '../../service.js'

import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = async ({ context }) => {
    const { token } =
        await context.auth.github.getAccessTokenFromAuthorizationCodeFlow(
            context.request,
        )

    logger.debug(token, 'Received access token from GitHub')

    const user = await getGithubUserInfo(token.access_token)

    logger.debug(user, 'Received user info from GitHub')

    const jwt = await encodeJWT({
        secret: 'test',
        token: {
            email: user.email,
            sub: user.id.toString(),
            name: user.name,
            picture: user.avatarUrl,
        },
    })

    return {
        status: Status.OK,
        body: {
            accessToken: jwt,
        },
    }
}
