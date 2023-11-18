import type { OAuth2Namespace } from '@fastify/oauth2'
import type {
    CONTEXT,
    GITHUB_AUTH_NS,
    SCOPED_CONTEXT,
} from '../api/constants.ts'
import type { Context } from '../api/context.js'
import type { BaseGenericContext } from '../api/controller.ts'
import type { UserJwt } from '../modules/user/jwt.js'

declare module 'fastify' {
    interface FastifyInstance {
        [CONTEXT]: Context
        [SCOPED_CONTEXT]: BaseGenericContext
        [GITHUB_AUTH_NS]: OAuth2Namespace
    }

    interface FastifyRequest {
        user: UserJwt
    }
}
