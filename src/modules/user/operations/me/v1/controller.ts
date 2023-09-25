import type { Controller } from '../../../../../api/controller.js'
import type { schema } from './schema.js'
import { Status } from '../../../../../api/constants.js'

export const controller: Controller<typeof schema> = async ({ ctx }) => {
    // const user = await userRepo.getById(ctx, ctx.user.sub)

    // console.log('\n\n')
    // console.dir({ user }, { depth: null })
    // console.log('\n\n')

    return ctx.response(Status.OK, {
        body: {
            email: ctx.user.email,
            id: ctx.user.sub,
            name: ctx.user.name,
            profileImageUrl: ctx.user.profileImageUrl,
        },
    })
}
