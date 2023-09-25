import type { FastifyAuthFunction } from '@fastify/auth'
import type { OAuth2Namespace } from '@fastify/oauth2'
import type {
    CONTEXT,
    GITHUB_AUTH_NS,
    VERIFY_USER_JWT,
} from '../api/constants.ts'
import type { Context } from '../api/context.js'

declare module 'fastify' {
    interface FastifyInstance {
        [CONTEXT]: Context
        [GITHUB_AUTH_NS]: OAuth2Namespace
        [VERIFY_USER_JWT]: FastifyAuthFunction
    }

    interface FastifyRequest {
        cookies: {
            accessToken?: string | undefined
        }
    }
}
