import { fastify } from 'fastify'
import type { Config } from '../config.js'
import type { Logger } from '../logger.js'
import type { DatabaseConnections } from './context.js'
import type { Server } from './server.js'
import { CONTEXT } from './constants.js'
import { errorHandler } from './errors/error-handler.js'
import { apiPlugin } from './plugins/api.js'

export async function initApi(
    config: Config,
    logger: Logger,
    db: DatabaseConnections,
): Promise<Server> {
    const server = fastify({
        bodyLimit: 1_048_576, // 1 MiB
        disableRequestLogging: !config.logRequests,
        logger,
    })

    server.decorate(CONTEXT, {
        config,
        db,
        logger,
    })

    server.setErrorHandler(errorHandler)

    await server.register(apiPlugin)

    return server as unknown as Server
}
