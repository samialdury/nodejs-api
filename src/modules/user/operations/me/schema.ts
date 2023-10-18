import { createSchema } from '../../../../api/controller.js'

export const schema = createSchema((s, t) => {
    return {
        response: {
            [s.OK]: t.Object({
                email: t.String(),
                id: t.String(),
                name: t.String(),
                profileImageUrl: t.Union([t.String(), t.Null()]),
            }),
        },
    }
})
