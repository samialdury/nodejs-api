import type { Controller } from '../../../../api/types.js'
import type { schema } from './schema.js'
import { Status } from '../../../../api/constants.js'
import { getGithubUserInfo } from '../../service/github.js'
import { encodeJWT } from '../../service/jwt.js'

export const controller: Controller<typeof schema> = async ({ context }) => {
    const { token } =
        await context.auth.github.getAccessTokenFromAuthorizationCodeFlow(
            context.request,
        )

    context.logger.debug(token, 'Received access token from GitHub')

    const user = await getGithubUserInfo(context, token.access_token)

    context.logger.debug(user, 'Received user info from GitHub')

    const jwt = await encodeJWT(context, {
        token: {
            email: user.email,
            name: user.name,
            picture: user.avatarUrl,
            sub: user.id.toString(),
        },
    })

    return {
        body: {
            accessToken: jwt,
        },
        status: Status.OK,
    }
}
