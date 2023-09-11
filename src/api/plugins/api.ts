import type { ServerPlugin } from '../types.js'
import { statusRouter } from '../../modules/status/router.js'
import { authPlugin } from './auth.js'
import { graphqlPlugin } from './graphql.js'
import { restPlugin } from './rest.js'

export const apiPlugin: ServerPlugin = async (server) => {
    await server.register(authPlugin)

    /**
     * @access public
     */
    await server.register(async (public_) => {
        await public_.register(statusRouter)
    })

    /**
     * @access private
     */
    await server.register(async (private_) => {
        private_.addHook('onRequest', server.auth([server.verifyBearerAuth!]))

        await private_.register(graphqlPlugin)
        await private_.register(restPlugin)
    })
}
