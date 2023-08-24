import { Octokit } from 'octokit'

import { logger } from '../../../logger.js'

export async function getGithubUserInfo(accessToken: string): Promise<{
    id: number
    name: string
    email: string
    avatarUrl: string
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
                logger.error('No email found')
                throw new Error('No email found')
            }
        }

        return {
            id: user.id,
            name: user.name ?? user.login,
            email: user.email,
            avatarUrl: user.avatar_url,
        }
    } catch (err) {
        logger.error(err, 'Error while getting GitHub user info')
        throw new Error('Error while getting GitHub user info')
    }
}
