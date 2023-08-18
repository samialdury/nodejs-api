import { Status } from '../../../../api/constants.js'
import type { ControllerSchema } from '../../../../api/types.js'
import { T } from '../../../../api/validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            project: T.String(),
            env: T.String(),
            version: T.String(),
        }),
    },
} satisfies ControllerSchema
