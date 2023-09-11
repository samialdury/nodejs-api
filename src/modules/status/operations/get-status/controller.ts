import type { Controller } from '../../../../api/types.js'
import type { schema } from './schema.js'
import { Status } from '../../../../api/constants.js'
import { config } from '../../../../config.js'

export const controller: Controller<typeof schema> = () => {
    return {
        body: {
            project: config.projectName,
            version: config.commitSha,
        },
        status: Status.OK,
    }
}
