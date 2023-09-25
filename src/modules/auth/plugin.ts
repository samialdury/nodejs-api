import { fastifyAuth } from '@fastify/auth'
import {
    type FastifyBearerAuthOptions,
    fastifyBearerAuth,
} from '@fastify/bearer-auth'
import { fastifyOauth2 } from '@fastify/oauth2'
import {
    CONTEXT,
    GITHUB_AUTH_NS,
    VERIFY_USER_JWT,
} from '../../api/constants.js'
import {
    type ServerRequest,
    type ServerResponse,
    serverPlugin,
} from '../../api/server.js'
import { authMiddleware } from './middleware.js'

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
                    await authMiddleware.verifyUserJwt(
                        server[CONTEXT],
                        key,
                        request,
                    )
                    return true
                } catch {
                    return false
                }
            },
            logLevel: 'warn',
            verifyErrorLogLevel: 'warn',
        } as FastifyBearerAuthOptions)

        server.decorate(
            VERIFY_USER_JWT,
            async (request: ServerRequest, response: ServerResponse) => {
                return authMiddleware.verifyUserJwtFromCookie(
                    server[CONTEXT],
                    request,
                    response,
                )
            },
        )

        // GitHub
        await server.register(fastifyOauth2, {
            callbackUri: `${server[CONTEXT].config.publicHost}${server[CONTEXT].config.githubLoginPath}/callback`,
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                // signed: true,
            },
            credentials: {
                auth: fastifyOauth2.GITHUB_CONFIGURATION,
                client: {
                    id: server[CONTEXT].config.githubClientId,
                    secret: server[CONTEXT].config.githubClientSecret,
                },
            },
            logLevel: 'warn',
            name: GITHUB_AUTH_NS,
            scope: ['read:user user:email'],
            startRedirectPath: server[CONTEXT].config.githubLoginPath,
        })
    },
    {
        fastify: '4.x',
        name: 'auth-plugin',
    },
)
