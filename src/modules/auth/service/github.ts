import { Octokit } from 'octokit'
import type { Context } from '../../../api/types.js'

export async function getGithubUserInfo(
    context: Context,
    accessToken: string,
): Promise<{
    avatarUrl: string
    email: string
    id: number
    name: string
}> {
    try {
        const gh = new Octokit({ auth: accessToken })

        const { data: user } = await gh.rest.users.getAuthenticated({})

        if (!user.email) {
            const { data: emails } =
                await gh.rest.users.listEmailsForAuthenticatedUser()

            if (emails.length > 0) {
                user.email =
                    emails.find((email) => email.primary)?.email ??
                    emails[0]!.email // eslint-disable-line @typescript-eslint/no-non-null-assertion
            } else {
                context.logger.error('No email found')
                throw new Error('No email found')
            }
        }

        return {
            avatarUrl: user.avatar_url,
            email: user.email,
            id: user.id,
            name: user.name ?? user.login,
        }
    } catch (err) {
        context.logger.error(err, 'Error while getting GitHub user info')
        throw new Error('Error while getting GitHub user info')
    }
}
