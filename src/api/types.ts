import type {
    TypeBoxTypeProvider,
    FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox'
import type {
    FastifyInstance,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    FastifySchema,
    FastifyRequest,
    RouteGenericInterface,
    FastifyReply,
    ContextConfigDefault,
    FastifyPluginAsync,
} from 'fastify'

import type { Logger } from '../logger.js'

export type APIServer = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    Logger,
    TypeBoxTypeProvider
>
