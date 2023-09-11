import type { ServerPlugin } from '../../api/types.js'
import { createController } from '../../api/controller.js'
import { config } from '../../config.js'
import { controller as githubCallbackController } from './operations/github-callback/controller.js'
import { schema as githubCallbackSchema } from './operations/github-callback/schema.js'

export const authRouter: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            `${config.githubLoginPath}/callback`,
            githubCallbackSchema,
            githubCallbackController,
        ),
    )
}
