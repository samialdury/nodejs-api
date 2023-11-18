import { fastifyAuth } from '@fastify/auth'
import {
    type FastifyBearerAuthOptions,
    fastifyBearerAuth,
} from '@fastify/bearer-auth'
import { fastifyOauth2 } from '@fastify/oauth2'
import { GITHUB_AUTH_NS } from '../../api/constants.js'
import { serverPlugin } from '../../api/server.js'
import { verifyUserJwt } from './middleware.js'

export const authPlugin = serverPlugin(
    async (server) => {
        await server.register(fastifyAuth, {
            logLevel: 'warn',
        })

        // @ts-expect-error the types are wrong
        await server.register(fastifyBearerAuth, {
            addHook: false,
            auth: async (key, request) => {
                try {
                    await verifyUserJwt(server.ctx.config, key, request)
                    return true
                } catch {
                    return false
                }
            },
            logLevel: 'warn',
            verifyErrorLogLevel: 'warn',
        } as FastifyBearerAuthOptions)

        // GitHub
        await server.register(fastifyOauth2, {
            callbackUri: `${server.ctx.config.publicHost}${server.ctx.config.githubLoginPath}/callback`,
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                // signed: true,
            },
            credentials: {
                auth: fastifyOauth2.GITHUB_CONFIGURATION,
                client: {
                    id: server.ctx.config.githubClientId,
                    secret: server.ctx.config.githubClientSecret,
                },
            },
            logLevel: 'warn',
            name: GITHUB_AUTH_NS,
            scope: ['read:user', 'user:email'],
            startRedirectPath: server.ctx.config.githubLoginPath,
        })
    },
    {
        fastify: '4.x',
        name: 'auth-plugin',
    },
)
