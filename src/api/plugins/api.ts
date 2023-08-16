import { fastifyPlugin } from 'fastify-plugin'
import { statusPlugin } from '../../modules/status/plugin.js'

export const restPlugin = fastifyPlugin(
    (server, _opts, done) => {
        server.register(statusPlugin)

        done()
    },
    {
        name: 'rest-plugin',
        fastify: '4.x',
    },
)
