import { createSchema } from '../../../../api/controller.js'
import { schemaTags } from '../../../../api/docs.js'

export const schema = createSchema((s, t) => {
    return {
        tags: [schemaTags.user.name],
        response: {
            [s.OK]: t.Object(
                {
                    email: t.String(),
                    id: t.String(),
                    name: t.String(),
                    profileImageUrl: t.Union([t.String(), t.Null()]),
                },
                {
                    title: 'Success',
                    description: 'Returns the user information',
                },
            ),
        },
    }
})
