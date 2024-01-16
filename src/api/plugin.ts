import fastifyCookie from '@fastify/cookie'
import type { ServerPlugin } from './server.js'
import { authPlugin } from '../modules/auth/plugin.js'
import { authRouter } from '../modules/auth/router.js'
import { statusRouter } from '../modules/status/router.js'
import { userRouter } from '../modules/user/router.js'
import { errorSchema, validationErrorSchema } from './errors/http-errors.js'

export const apiPlugin: ServerPlugin = async (server) => {
    server.addSchema(errorSchema)
    server.addSchema(validationErrorSchema)

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
        await public_.register(authRouter)
    })

    /**
     * @access private
     * All routes in this plugin require a valid JWT in the Authorization header.
     */
    await server.register(async (private_) => {
        private_.addHook(
            'onRequest',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            server.auth([server.verifyBearerAuth!]),
        )

        await private_.register(userRouter)
    })
}
