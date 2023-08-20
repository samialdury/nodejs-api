import { Status } from '../../../../api/constants.js'
import type { Controller } from '../../../../api/types.js'
import { config } from '../../../../config.js'

import type { schema } from './schema.js'

export const controller: Controller<typeof schema> = () => {
    return {
        status: Status.OK,
        body: {
            project: config.projectName,
            env: config.nodeEnv,
            version: config.commitSha,
        },
    }
}
