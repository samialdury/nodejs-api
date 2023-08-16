import { fastify } from 'fastify'

import type { Config } from '../config.js'
import type { Logger } from '../logger.js'

import type { APIServer } from './types.js'
import { graphqlPlugin } from './plugins/graphql.js'
import { authPlugin } from './plugins/auth.js'
import { restPlugin } from './plugins/api.js'

export async function initApi(
    config: Config,
    logger: Logger,
): Promise<APIServer> {
    const server = fastify({
        logger,
        disableRequestLogging: !config.logRequests,
        bodyLimit: 1_048_576, // 1 MiB
    })

    await server.register(authPlugin)

    await server.register(graphqlPlugin)

    await server.register(restPlugin)

    await server.listen({
        host: config.host,
        port: config.port,
    })

    return server
}
