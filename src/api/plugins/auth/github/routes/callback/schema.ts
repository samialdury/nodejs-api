import { Status } from '../../../../../constants.js'
import type { ControllerSchema } from '../../../../../types.js'
import { T } from '../../../../../validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            accessToken: T.String(),
        }),
    },
} satisfies ControllerSchema
