import type { Controller } from '../../../../api/controller.js'
import type { UserModuleContext } from '../../context.js'
import type { schema } from './schema.js'

export const controller: Controller<UserModuleContext, typeof schema> = ({
    s,
    ctx,
}) => {
    return ctx.response(s.OK, {
        body: {
            email: ctx.request.user.email,
            id: ctx.request.user.sub,
            name: ctx.request.user.name,
            profileImageUrl: ctx.request.user.profileImageUrl,
        },
    })
}
