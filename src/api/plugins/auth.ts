import { fastifyPlugin } from 'fastify-plugin'

export const authPlugin = fastifyPlugin(
    async (server) => {
        await Promise.resolve()
    },
    {
        name: 'auth-plugin',
        fastify: '4.x',
    },
)
