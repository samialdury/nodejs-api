import type { FastifyPluginAsync } from 'fastify'

import { statusPlugin } from '../../modules/status/routes/plugin.js'

import { authPlugin } from './auth.js'
import { graphqlPlugin } from './graphql.js'
import { restPlugin } from './rest.js'

export const apiPlugin: FastifyPluginAsync = async (server) => {
    await server.register(authPlugin)

    // Public
    await server.register(async (public_) => {
        await public_.register(statusPlugin)
    })

    // Protected
    await server.register(async (private_) => {
        private_.addHook('onRequest', server.auth([server.verifyBearerAuth!]))

        await private_.register(graphqlPlugin)
        await private_.register(restPlugin)
    })
}
