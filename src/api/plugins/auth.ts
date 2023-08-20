import { fastifyAuth } from '@fastify/auth'
import { fastifyBearerAuth } from '@fastify/bearer-auth'
import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'

import { config } from '../../config.js'
import { logger } from '../../logger.js'
import { authRouter } from '../../modules/auth/router.js'
import { decodeJWT } from '../../modules/auth/service/jwt.js'
import type { ServerPlugin } from '../types.js'

export const authPlugin: ServerPlugin = fastifyPlugin(
    async (server) => {
        await server.register(fastifyAuth, {
            logLevel: 'debug',
        })

        // @ts-expect-error types are wrong
        await server.register(fastifyBearerAuth, {
            addHook: false,
            verifyErrorLogLevel: 'debug',
            logLevel: 'debug',
            auth: async (key, _request) => {
                try {
                    const value = await decodeJWT({
                        token: key,
                    })

                    logger.info(value, 'Decoded JWT')

                    return true
                } catch (err) {
                    logger.debug(err, 'Failed to decode JWT')
                    return false
                }
            },
        })

        // GitHub
        await server.register(fastifyOauth2, {
            name: 'githubOAuth2',
            scope: ['read:user user:email'],
            credentials: {
                client: {
                    id: config.githubClientId,
                    secret: config.githubClientSecret,
                },
                auth: fastifyOauth2.GITHUB_CONFIGURATION,
            },
            startRedirectPath: config.githubLoginPath,
            callbackUri: `${config.publicHost}${config.githubLoginPath}/callback`,
        })

        await server.register(authRouter)
    },
    {
        name: 'auth-plugin',
        fastify: '4.x',
    },
)
