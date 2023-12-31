import { createSchema } from '../../../../api/controller.js'

export const schema = createSchema((S, T) => {
    return {
        response: {
            [S.OK]: T.Object({
                accessToken: T.String(),
            }),
        },
    }
})
