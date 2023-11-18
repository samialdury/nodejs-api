import type { ServerPlugin } from '../../api/server.js'
import type { UserModuleContext } from './context.js'
import { SCOPED_CONTEXT } from '../../api/constants.js'
import { createController } from '../../api/controller.js'
import { newAccountProviderRepository } from '../account-provider/repository.js'
import * as me from './operations/me/route.js'
import { newUserRepository } from './repository.js'
import { newUserService } from './service.js'

export const userRouter: ServerPlugin = async (server) => {
    server.decorate(SCOPED_CONTEXT, {
        userService: newUserService(
            server.ctx.config,
            newUserRepository(server.ctx.mySql),
            newAccountProviderRepository(server.ctx.mySql),
        ),
    } satisfies UserModuleContext)

    server.route(createController(server, 'GET', '/users/me', me))
}
