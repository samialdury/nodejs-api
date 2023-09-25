import type { ServerPlugin } from '../../api/server.js'
import { createController } from '../../api/controller.js'
import { controller as getStatusController } from './operations/get-status/controller.js'
import { schema as getStatusSchema } from './operations/get-status/schema.js'

export const statusRouter: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            '/status',
            getStatusSchema,
            getStatusController,
        ),
    )
}
