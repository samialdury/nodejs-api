import type { ServerPlugin } from '../../api/server.js'
import type { AuthModuleContext } from './context.js'
import { SCOPED_CONTEXT } from '../../api/constants.js'
import { createController } from '../../api/controller.js'
import { newAccountProviderRepository } from '../account-provider/repository.js'
import { newUserRepository } from '../user/repository.js'
import { newUserService } from '../user/service.js'
import * as githubCallback from './operations/github-callback/route.js'

export const authRouter: ServerPlugin = async (server) => {
    server.decorate(SCOPED_CONTEXT, {
        userService: newUserService(
            server.ctx.config,
            newUserRepository(server.ctx.mySql),
            newAccountProviderRepository(server.ctx.mySql),
        ),
    } satisfies AuthModuleContext)

    server.route(
        createController(
            server,
            'GET',
            `${server.ctx.config.githubLoginPath}/callback`,
            githubCallback,
        ),
    )
}
