import { fastify } from 'fastify'
import type { Config } from '../config.js'
import type { Logger } from '../logger.js'
import type { Server } from './types.js'
import { apiPlugin } from './plugins/api.js'

export async function initApi(config: Config, logger: Logger): Promise<Server> {
    const server = fastify({
        bodyLimit: 1_048_576, // 1 MiB
        disableRequestLogging: !config.logRequests,
        logger,
    })

    await server.register(apiPlugin)

    await server.listen({
        host: config.host,
        port: config.port,
    })

    return server as unknown as Server
}
