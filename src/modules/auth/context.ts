import type { UserService } from '../user/service.js'

export interface AuthModuleContext {
    userService: UserService
}
