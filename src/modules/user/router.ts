import type { ServerPlugin } from '../../api/server.js'
import { createController } from '../../api/controller.js'
import * as me from './operations/me/route.js'

export const userRouter: ServerPlugin = async (server) => {
    server.route(createController(server, 'GET', '/users/me', me))
}
