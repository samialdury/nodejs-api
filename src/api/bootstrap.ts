import type { Config } from '../config.js'
import type { Logger } from '../logger.js'
import type { DatabaseConnections } from './context.js'
import { CONTEXT } from './constants.js'
import { errorHandler } from './errors/error-handler.js'
import { apiPlugin } from './plugin.js'
import { type Server, createServer } from './server.js'

export async function initApi(
    config: Config,
    logger: Logger,
    dbs: DatabaseConnections,
): Promise<Server> {
    const server = createServer({
        bodyLimit: 1_048_576, // 1 MiB
        disableRequestLogging: !config.logRequests,
        logger,
    }) as unknown as Server

    server.decorate(CONTEXT, {
        config,
        logger,
        ...dbs,
    })

    server.setErrorHandler(async (err, request, response) => {
        return errorHandler(server, err, request, response)
    })

    await server.register(apiPlugin)

    return server
}
