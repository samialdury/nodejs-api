import type { ServerPlugin } from '../../api/server.js'
import { createController } from '../../api/controller.js'
import { githubCallback } from './operations/github-callback/route.js'

export const authRouter: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            `${server.ctx.config.githubLoginPath}/callback`,
            githubCallback,
        ),
    )
}
