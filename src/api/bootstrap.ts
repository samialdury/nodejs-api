import { fastify } from 'fastify'

import type { Config } from '../config.js'
import type { Logger } from '../logger.js'

import { apiPlugin } from './plugins/api.js'
import type { Server } from './types.js'

export async function initApi(config: Config, logger: Logger): Promise<Server> {
    const server = fastify({
        logger,
        disableRequestLogging: !config.logRequests,
        bodyLimit: 1_048_576, // 1 MiB
    })

    await server.register(apiPlugin)

    await server.listen({
        host: config.host,
        port: config.port,
    })

    return server as unknown as Server
}
