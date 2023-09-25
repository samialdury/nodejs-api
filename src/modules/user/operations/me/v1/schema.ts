import type { ControllerSchema } from '../../../../../api/server.js'
import { Status } from '../../../../../api/constants.js'
import { T } from '../../../../../api/validation.js'

export const schema = {
    response: {
        [Status.OK]: T.Object({
            email: T.String(),
            id: T.String(),
            name: T.String(),
            profileImageUrl: T.Union([T.String(), T.Null()]),
        }),
    },
} satisfies ControllerSchema
