import type { Controller } from '../../../../api/controller.js'
import type { StatusModuleContext } from '../../context.js'
import type { schema } from './schema.js'

export const controller: Controller<StatusModuleContext, typeof schema> = ({
    s,
    ctx,
}) => {
    return ctx.response(s.OK, {
        body: {
            project: ctx.config.projectName,
            version: ctx.config.commitSha,
        },
    })
}
