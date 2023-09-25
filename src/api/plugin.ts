/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fastifyCookie from '@fastify/cookie'
import type { ServerPlugin } from './server.js'
import { authPlugin } from '../modules/auth/plugin.js'
import { authRouter } from '../modules/auth/router.js'
import { statusRouter } from '../modules/status/router.js'
import { userRouter } from '../modules/user/router.js'
import { CONTEXT, VERIFY_USER_JWT } from './constants.js'

export const apiPlugin: ServerPlugin = async (server) => {
    await server.register(fastifyCookie, {
        logLevel: 'warn',
        parseOptions: {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            // signed: true,
        },
        secret: server[CONTEXT].config.cookieSecret,
    })

    await server.register(authPlugin)

    /**
     * @access public
     * All routes in this plugin do not require any authentication.
     */
    await server.register(async (public_) => {
        await public_.register(statusRouter)
        await public_.register(authRouter)
    })

    /**
     * @access private
     * All routes in this plugin require a valid JWT cookie.
     */
    await server.register(async (private_) => {
        private_.addHook(
            'onRequest',
            server.auth([server[VERIFY_USER_JWT], server.verifyBearerAuth!], {
                relation: 'or',
            }),
        )

        await private_.register(userRouter)
    })
}
