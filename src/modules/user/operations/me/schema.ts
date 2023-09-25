import { createSchema } from '../../../../api/controller.js'

export const schema = createSchema((S, T) => {
    return {
        response: {
            [S.OK]: T.Object({
                email: T.String(),
                id: T.String(),
                name: T.String(),
                profileImageUrl: T.Union([T.String(), T.Null()]),
            }),
        },
    }
})
