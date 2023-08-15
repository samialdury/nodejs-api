import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { fastify } from 'fastify'

import type { Config } from '../config.js'
import type { Logger } from '../logger.js'

import type { Context } from './graphql/context.js'
import { resolvers } from './graphql/resolvers.js'
import type { APIServer } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function initApi(
    config: Config,
    logger: Logger,
): Promise<APIServer> {
    const server = fastify({
        logger,
        disableRequestLogging: !config.logRequests,
        bodyLimit: 1_048_576, // 1 MiB
    })

    const typeDefs = await readFile(
        path.join(__dirname, '..', '..', 'schema.gql'),
        'utf8',
    )

    const apollo = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        plugins: [fastifyApolloDrainPlugin(server)],
    })

    await apollo.start()

    await server.register(fastifyApollo(apollo))

    await server.listen({
        host: config.host,
        port: config.port,
    })

    return server
}
