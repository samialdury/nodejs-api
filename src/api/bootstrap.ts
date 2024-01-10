import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type { Config } from '../config.js'
import type { Logger } from '../logger.js'
import type { DatabaseConnections } from './context.js'
import { CONTEXT } from './constants.js'
import {
    getSwaggerOptions,
    getSwaggerUiOptions,
    writeOpenApiSpec,
} from './docs.js'
import { errorHandler } from './errors/error-handler.js'
import { apiPlugin } from './plugin.js'
import { type Server, createServer } from './server.js'

export async function initApi(
    config: Config,
    logger: Logger,
    dbs: DatabaseConnections,
): Promise<Server> {
    const server = createServer({
        bodyLimit: config.requestBodyLimitBytes,
        disableRequestLogging: !config.logRequests,
        logger,
        forceCloseConnections: config.debugMode || 'idle',
    }) as unknown as Server

    server.decorate(CONTEXT, {
        config,
        logger,
        ...dbs,
    })

    server.setErrorHandler(async (err, request, response) => {
        return errorHandler(server, err, request, response)
    })

    if (config.debugMode) {
        await server.register(fastifySwagger, getSwaggerOptions(server, config))
        await server.register(fastifySwaggerUi, getSwaggerUiOptions())
    }

    await server.register(apiPlugin)

    await server.ready()

    if (config.debugMode) {
        await writeOpenApiSpec(server.swagger({ yaml: true }))
    }

    return server
}
