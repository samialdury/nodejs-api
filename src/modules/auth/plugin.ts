import { fastifyPlugin } from 'fastify-plugin'

import * as githubCallback from './github/callback/controller.js'

export default fastifyPlugin(
    async (server) => {
        server.route({
            method: 'POST',
            url: '/auth/github/callback',
            handler(request, response) {
                // request.b
            },
        })
    },
    {
        name: 'auth-module',
        fastify: '4.x',
    },
)
