import type { RouteOptions } from 'fastify'

import { Status } from '../../../../api/constants.js'
import type {
    Controller,
    Handler,
    HandlerSchema,
} from '../../../../api/types.js'
import { T } from '../../../../api/validation.js'
import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = () => {
    return {}
}
