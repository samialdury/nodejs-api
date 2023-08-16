import { Status } from '../../../../api/constants.js'
import type { ControllerSchema } from '../../../../api/types.js'
import { T } from '../../../../api/validation.js'

export const schema = {
    body: T.Object({
        name: T.String({ minLength: 2, maxLength: 50 }),
        email: T.String({ format: 'email' }),
    }),
    response: {
        [Status.CREATED]: T.Object({
            id: T.String({ minLength: 16, maxLength: 16 }),
            name: T.String({ minLength: 2, maxLength: 50 }),
            email: T.String({ format: 'email' }),
        }),
    },
} satisfies ControllerSchema
