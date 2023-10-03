import type { Controller, Cookies } from '../../../../api/controller.js'
import type { schema } from './schema.js'
import { ConflictError } from '../../../../api/errors/http-errors.js'
import { userService } from '../../../user/service.js'
import { getGithubUserInfo } from '../../service/github.js'

function setAccessTokenCookie(accessToken: string): Cookies {
    return {
        accessToken: {
            options: {
                // Expires in 30 days
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                maxAge: 30 * 24 * 60 * 60,
            },
            value: accessToken,
        },
    }
}

export const controller: Controller<typeof schema> = async ({ s, ctx }) => {
    const { token } =
        await ctx.auth.github.getAccessTokenFromAuthorizationCodeFlow(
            ctx.request,
        )

    ctx.logger.debug(token, 'Received access token from GitHub')

    const githubUser = await getGithubUserInfo(ctx, token.access_token)

    ctx.logger.debug(githubUser, 'Received user info from GitHub')

    const user = await userService.getByExternalId(
        ctx,
        githubUser.id.toString(),
    )

    if (user) {
        const accessToken = await userService.createJwt(ctx, user)

        return ctx.response(s.OK, {
            body: {
                accessToken,
            },
            cookies: setAccessTokenCookie(accessToken),
        })
    }

    const userByEmail = await userService.getByEmail(ctx, githubUser.email)

    if (userByEmail) {
        ctx.logger.debug(
            { email: githubUser.email },
            'User with email already exists',
        )

        throw new ConflictError(
            'User with email already exists',
            'signup-email-exists',
        )
    }

    ctx.logger.debug('User not found, creating new user')

    const newUser = await userService.create(ctx, 'github', {
        email: githubUser.email,
        externalId: githubUser.id.toString(),
        name: githubUser.name,
        profileImageUrl: githubUser.profileImageUrl,
    })

    const accessToken = await userService.createJwt(ctx, newUser)

    return ctx.response(s.OK, {
        body: {
            accessToken,
        },
        cookies: setAccessTokenCookie(accessToken),
    })
}
