import { createController } from '../../api/controller.js'
import type { ServerPlugin } from '../../api/types.js'

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
