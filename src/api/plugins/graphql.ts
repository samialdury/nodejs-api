import { fastifyPlugin } from 'fastify-plugin'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'

import type { Context } from '../graphql/context.js'
import { resolvers } from '../graphql/resolvers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const graphqlPlugin = fastifyPlugin(
    async (server) => {
        const typeDefs = await readFile(
            path.join(__dirname, '../../../', 'schema.gql'),
            'utf8',
        )

        const apollo = new ApolloServer<Context>({
            typeDefs,
            resolvers,
            plugins: [fastifyApolloDrainPlugin(server)],
        })

        await apollo.start()

        await server.register(fastifyApollo(apollo))
    },
    {
        name: 'graphql-plugin',
        fastify: '4.x',
    },
)
