import { createController, type ServerPlugin } from '../../../api/types.js'

import { controller as meController } from './me/controller.js'
import { schema as meSchema } from './me/schema.js'

export const userPlugin: ServerPlugin = async (server) => {
    server.route(createController(server, 'GET', '/me', meSchema, meController))
}
