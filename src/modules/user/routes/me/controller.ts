import { Status } from '../../../../api/constants.js'
import type { Controller } from '../../../../api/types.js'

import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = () => {
    return {
        status: Status.NO_CONTENT,
    }
}
