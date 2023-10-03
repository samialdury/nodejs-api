import { createSchema } from '../../../../api/controller.js'

export const schema = createSchema((s, t) => {
    return {
        response: {
            [s.OK]: t.Object({
                project: t.String(),
                version: t.String(),
            }),
        },
    }
})
