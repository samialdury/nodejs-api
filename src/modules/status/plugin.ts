import { fastifyPlugin } from 'fastify-plugin'
import { createController } from '../../api/types.js'
import { controller as getStatus } from './get-status/controller.js'

export const statusPlugin = fastifyPlugin(
    async (server) => {
        /**
         * GET /status
         */
        server.route(
            createController(
                {
                    method: 'GET',
                    url: '/status',
                },
                server,
                getStatus,
            ),
        )

        await Promise.resolve()
    },
    {
        name: 'status-plugin',
        fastify: '4.x',
    },
)
