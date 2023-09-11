import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import type { GraphQLContext, ServerPlugin } from '../types.js'
import { logger } from '../../logger.js'
import { resolvers } from '../../modules/resolvers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const graphqlPlugin: ServerPlugin = async (server) => {
    const typeDefs = await readFile(
        path.join(__dirname, '../../../', 'schema.gql'),
        'utf8',
    )

    const apollo = new ApolloServer<GraphQLContext>({
        plugins: [fastifyApolloDrainPlugin(server)],
        resolvers,
        typeDefs,
    })

    await apollo.start()

    await server.register(fastifyApollo(apollo), {
        context: async (request, _reply) => {
            logger.debug(request.headers.authorization, 'Request headers')
            return {}
        },
    })
}
