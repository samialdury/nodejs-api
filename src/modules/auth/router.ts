import type { ServerPlugin } from '../../api/types.js'
import { createController } from '../../api/controller.js'
import { controller as githubCallbackController } from './operations/github-callback/controller.js'
import { schema as githubCallbackSchema } from './operations/github-callback/schema.js'

export const authRouter: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            `${server.context.config.githubLoginPath}/callback`,
            githubCallbackSchema,
            githubCallbackController,
        ),
    )
}
