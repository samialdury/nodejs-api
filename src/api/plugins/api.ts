import fastifyCookie from '@fastify/cookie'
import type { ServerPlugin } from '../server.js'
import { statusRouter } from '../../modules/status/router.js'
import { VERIFY_USER_JWT } from '../constants.js'
import { authPlugin } from './auth.js'
import { restPlugin } from './rest.js'

export const apiPlugin: ServerPlugin = async (server) => {
    await server.register(fastifyCookie, {
        logLevel: 'warn',
        parseOptions: {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            // signed: true,
        },
        secret: server.ctx.config.cookieSecret,
    })

    await server.register(authPlugin)

    /**
     * @access public
     * All routes in this plugin do not require any authentication.
     */
    await server.register(async (public_) => {
        await public_.register(statusRouter)
    })

    /**
     * @access private
     * All routes in this plugin require a valid JWT cookie.
     */
    await server.register(async (private_) => {
        private_.addHook('onRequest', server.auth([server[VERIFY_USER_JWT]]))

        await private_.register(restPlugin)
    })
}
