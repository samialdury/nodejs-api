import { Octokit } from 'octokit'
import type { Context } from '../../../api/context.js'

export async function getGithubUserInfo(
    ctx: Context,
    accessToken: string,
): Promise<{
    email: string
    id: number
    name: string
    profileImageUrl: string
}> {
    try {
        const gh = new Octokit({ auth: accessToken })

        const { data: user } = await gh.rest.users.getAuthenticated()

        if (!user.email) {
            const { data: emails } =
                await gh.rest.users.listEmailsForAuthenticatedUser()

            if (emails.length > 0) {
                user.email =
                    emails.find((email) => email.primary)?.email ??
                    emails[0]!.email // eslint-disable-line @typescript-eslint/no-non-null-assertion
            } else {
                ctx.logger.error('No email found')
                throw new Error('No email found')
            }
        }

        return {
            email: user.email,
            id: user.id,
            name: user.name ?? user.login,
            profileImageUrl: user.avatar_url,
        }
    } catch (err) {
        ctx.logger.error(err, 'Error while getting GitHub user info')
        throw new Error('Error while getting GitHub user info')
    }
}
