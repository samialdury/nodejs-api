import type { CONTEXT } from './api/constants.js'
import type { Context } from './api/types.ts'

declare module 'fastify' {
    interface FastifyInstance {
        [CONTEXT]: Context
    }
}
