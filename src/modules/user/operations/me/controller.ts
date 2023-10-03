import type { Controller } from '../../../../api/controller.js'
import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = ({ s, ctx }) => {
    return ctx.response(s.OK, {
        body: {
            email: ctx.user.email,
            id: ctx.user.sub,
            name: ctx.user.name,
            profileImageUrl: ctx.user.profileImageUrl,
        },
    })
}
