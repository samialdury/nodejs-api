import { userRouter } from '../../modules/user/router.js'
import type { ServerPlugin } from '../types.js'

export const restPlugin: ServerPlugin = async (server) => {
    await server.register(userRouter)
}
