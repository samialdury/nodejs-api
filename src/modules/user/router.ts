import { createController } from '../../api/controller.js'
import type { ServerPlugin } from '../../api/types.js'

import { controller as meController } from './operations/me/controller.js'
import { schema as meSchema } from './operations/me/schema.js'

export const userRouter: ServerPlugin = async (server) => {
    server.route(createController(server, 'GET', '/me', meSchema, meController))
}
