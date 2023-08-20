import { Status } from '../../../../api/constants.js'
import type { Controller } from '../../../../api/types.js'
import { logger } from '../../../../logger.js'
import { getGithubUserInfo } from '../../service/github.js'
import { encodeJWT } from '../../service/jwt.js'

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
