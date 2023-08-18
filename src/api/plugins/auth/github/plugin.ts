import { createController, type ServerPlugin } from '../../../types.js'

import { controller as githubCallbackController } from './routes/callback/controller.js'
import { schema as githubCallbackSchema } from './routes/callback/schema.js'

export const githubAuthPlugin: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            '/login/github/callback',
            githubCallbackSchema,
            githubCallbackController,
        ),
    )
}
