import type { Controller } from '../../../../api/controller.js'
import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = ({ S, ctx }) => {
    return ctx.response(S.OK, {
        body: {
            project: ctx.config.projectName,
            version: ctx.config.commitSha,
        },
    })
}
