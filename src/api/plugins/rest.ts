import type { ServerPlugin } from '../types.js'
import { userRouter } from '../../modules/user/router.js'

export const restPlugin: ServerPlugin = async (server) => {
    await server.register(userRouter)
}
