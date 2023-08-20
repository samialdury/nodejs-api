import { Status } from '../../../../api/constants.js'
import type { ControllerSchema } from '../../../../api/types.js'
import { T } from '../../../../api/validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            accessToken: T.String(),
        }),
    },
} satisfies ControllerSchema
