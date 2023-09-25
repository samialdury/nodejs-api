export type { OAuth2Namespace } from '@fastify/oauth2'
export type {
    FastifyError as ServerError,
    FastifyInstance as Server,
    FastifyPluginAsync as ServerPlugin,
    FastifyReply as ServerResponse,
    FastifyRequest as ServerRequest,
    FastifySchema as ControllerSchema,
    HTTPMethods,
    RouteOptions,
} from 'fastify'
export { fastify as createServer } from 'fastify'
export { fastifyPlugin as serverPlugin } from 'fastify-plugin'
