import { createSchema } from '../../../../api/controller.js'
import { schemaTags } from '../../../../api/docs.js'

export const schema = createSchema(
    (S, T) => {
        return {
            tags: [schemaTags.auth.name],
            response: {
                [S.OK]: T.Object(
                    {
                        accessToken: T.String(),
                    },
                    {
                        title: 'Success',
                        description: 'Returns the access token',
                    },
                ),
            },
        }
    },
    {
        withAuthorization: false,
    },
)
