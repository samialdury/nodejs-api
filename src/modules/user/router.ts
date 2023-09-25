import type { ServerPlugin } from '../../api/server.js'
import { createController } from '../../api/controller.js'
import { controller as meControllerV1 } from './operations/me/v1/controller.js'
import { schema as meSchemaV1 } from './operations/me/v1/schema.js'

export const userRouter: ServerPlugin = async (server) => {
    server.route(
        createController(
            server,
            'GET',
            '/v1/users/me',
            meSchemaV1,
            meControllerV1,
        ),
    )
}
