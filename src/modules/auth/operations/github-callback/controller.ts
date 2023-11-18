import type { Controller } from '../../../../api/controller.js'
import type { AuthModuleContext } from '../../context.js'
import type { schema } from './schema.js'
import { ConflictError } from '../../../../api/errors/http-errors.js'
import { getGithubUserInfo } from '../../service/github.js'

export const controller: Controller<AuthModuleContext, typeof schema> = async ({
    s,
    ctx,
}) => {
    const { token } =
        await ctx.auth.github.getAccessTokenFromAuthorizationCodeFlow(
            ctx.request,
        )

    ctx.logger.debug(token, 'Received access token from GitHub')

    const githubUser = await getGithubUserInfo(ctx, token.access_token)

    ctx.logger.debug(githubUser, 'Received user info from GitHub')

    const user = await ctx.userService.getByExternalId(githubUser.id.toString())

    if (user) {
        const accessToken = await ctx.userService.createJwt(user)

        return ctx.response(s.OK, {
            body: {
                accessToken,
            },
        })
    }

    const userByEmail = await ctx.userService.getByEmail(githubUser.email)

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

    const newUser = await ctx.userService.create('github', {
        email: githubUser.email,
        externalId: githubUser.id.toString(),
        name: githubUser.name,
        profileImageUrl: githubUser.profileImageUrl,
    })

    const accessToken = await ctx.userService.createJwt(newUser)

    return ctx.response(s.OK, {
        body: {
            accessToken,
        },
    })
}
