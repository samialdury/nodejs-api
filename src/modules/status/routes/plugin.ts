import { createController, type ServerPlugin } from '../../../api/types.js'

import { controller as getStatusController } from './get-status/controller.js'
import { schema as getStatusSchema } from './get-status/schema.js'

export const statusPlugin: ServerPlugin = async (server) => {
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
