import type { Controller } from '../../../../api/controller.js'
import type { schema } from './schema.js'
import { Status } from '../../../../api/constants.js'

export const controller: Controller<typeof schema> = ({ ctx }) => {
    return ctx.response(Status.OK, {
        body: {
            project: ctx.config.projectName,
            version: ctx.config.commitSha,
        },
    })
}
