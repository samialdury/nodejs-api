import type { Context } from './api/types.ts'

declare module 'fastify' {
    interface FastifyInstance {
        context: Context
    }
}
