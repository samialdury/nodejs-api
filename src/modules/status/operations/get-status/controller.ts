import type { Controller } from '../../../../api/types.js'
import type { schema } from './schema.js'
import { Status } from '../../../../api/constants.js'

export const controller: Controller<typeof schema> = ({ context }) => {
    return {
        body: {
            project: context.config.projectName,
            version: context.config.commitSha,
        },
        status: Status.OK,
    }
}
