import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'

import { logger } from '../../logger.js'
import { resolvers } from '../../modules/resolvers.js'
import type { GraphQLContext, ServerPlugin } from '../types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const graphqlPlugin: ServerPlugin = async (server) => {
    const typeDefs = await readFile(
        path.join(__dirname, '../../../', 'schema.gql'),
        'utf8',
    )

    const apollo = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        plugins: [fastifyApolloDrainPlugin(server)],
    })

    await apollo.start()

    await server.register(fastifyApollo(apollo), {
        context: async (request, _reply) => {
            logger.debug(request.headers.authorization, 'Request headers')
            return {}
        },
    })
}
