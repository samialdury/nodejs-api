import { userPlugin } from '../../modules/user/routes/plugin.js'
import type { ServerPlugin } from '../types.js'

export const restPlugin: ServerPlugin = async (server) => {
    await server.register(userPlugin, { prefix: '/user' })
}
