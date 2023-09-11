import { fastifyAuth } from '@fastify/auth'
import { fastifyBearerAuth } from '@fastify/bearer-auth'
import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'
import type { ServerPlugin } from '../types.js'
import { authRouter } from '../../modules/auth/router.js'
import { decodeJWT } from '../../modules/auth/service/jwt.js'

export const authPlugin: ServerPlugin = fastifyPlugin(
    async (server) => {
        await server.register(fastifyAuth, {
            logLevel: 'debug',
        })

        // @ts-expect-error types are wrong
        await server.register(fastifyBearerAuth, {
            addHook: false,
            auth: async (key, _request) => {
                try {
                    const value = await decodeJWT(server.context, {
                        token: key,
                    })

                    server.context.logger.info(value, 'Decoded JWT')

                    return true
                } catch (err) {
                    server.context.logger.debug(err, 'Failed to decode JWT')
                    return false
                }
            },
            logLevel: 'debug',
            verifyErrorLogLevel: 'debug',
        })

        // GitHub
        await server.register(fastifyOauth2, {
            callbackUri: `${server.context.config.publicHost}${server.context.config.githubLoginPath}/callback`,
            credentials: {
                auth: fastifyOauth2.GITHUB_CONFIGURATION,
                client: {
                    id: server.context.config.githubClientId,
                    secret: server.context.config.githubClientSecret,
                },
            },
            name: 'githubOAuth2',
            scope: ['read:user user:email'],
            startRedirectPath: server.context.config.githubLoginPath,
        })

        await server.register(authRouter)
    },
    {
        fastify: '4.x',
        name: 'auth-plugin',
    },
)
