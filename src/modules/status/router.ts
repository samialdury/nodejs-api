import type { ServerPlugin } from '../../api/server.js'
import { createController } from '../../api/controller.js'
import { status } from './operations/get-status/route.js'

export const statusRouter: ServerPlugin = async (server) => {
    server.route(createController(server, 'GET', '/status', status))
}
