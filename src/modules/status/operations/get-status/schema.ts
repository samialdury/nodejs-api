import type { ControllerSchema } from '../../../../api/server.js'
import { Status } from '../../../../api/constants.js'
import { T } from '../../../../api/validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            project: T.String(),
            version: T.String(),
        }),
    },
} satisfies ControllerSchema
