import type { ControllerSchema } from '../../../../../api/types.js'
import { Status } from '../../../../../api/constants.js'
import { T } from '../../../../../api/validation.js'

export const schema = {
    response: {
        [Status.NO_CONTENT]: T.Never(),
    },
} satisfies ControllerSchema
