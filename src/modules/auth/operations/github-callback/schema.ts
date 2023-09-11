import type { ControllerSchema } from '../../../../api/types.js'
import { Status } from '../../../../api/constants.js'
import { T } from '../../../../api/validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            accessToken: T.String(),
        }),
    },
} satisfies ControllerSchema
