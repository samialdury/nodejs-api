import { createSchema } from '../../../../api/controller.js'
import { schemaTags } from '../../../../api/docs.js'

export const schema = createSchema(
    (s, t) => {
        return {
            tags: [schemaTags.health.name],
            response: {
                [s.OK]: t.Object(
                    {
                        project: t.String(),
                        version: t.String(),
                    },
                    {
                        title: 'Success',
                        description: 'Returns info about the service',
                    },
                ),
            },
        }
    },
    {
        withAuthorization: false,
    },
)
