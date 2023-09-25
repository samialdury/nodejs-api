import { fastifyAuth } from '@fastify/auth'
import { fastifyOauth2 } from '@fastify/oauth2'
import { fastifyPlugin } from 'fastify-plugin'
import type { ServerPlugin, ServerRequest, ServerResponse } from '../server.js'
import { authMiddleware } from '../../modules/auth/middleware.js'
import { GITHUB_AUTH_NS, VERIFY_USER_JWT } from '../constants.js'

export const authPlugin: ServerPlugin = fastifyPlugin(
    async (server) => {
        await server.register(fastifyAuth, {
            logLevel: 'warn',
        })

        server.decorate(
            VERIFY_USER_JWT,
            async (request: ServerRequest, response: ServerResponse) => {
                return authMiddleware.verifyUserJwt(
                    server.ctx,
                    request,
                    response,
                )
            },
        )

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
            scope: ['read:user user:email'],
            startRedirectPath: server.ctx.config.githubLoginPath,
        })
    },
    {
        fastify: '4.x',
        name: 'auth-plugin',
    },
)
