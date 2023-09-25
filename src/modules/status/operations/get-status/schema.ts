import { createSchema } from '../../../../api/controller.js'

export const schema = createSchema((S, T) => {
    return {
        response: {
            [S.OK]: T.Object({
                project: T.String(),
                version: T.String(),
            }),
        },
    }
})
