import type { Resolvers } from '../__generated__/resolvers-types.js'
import { config } from '../config.js'

import * as userService from './user/service.js'

export const resolvers: Resolvers = {
    Query: {
        status: () => {
            return {
                project: config.projectName,
                env: config.nodeEnv,
                version: config.commitSha,
            }
        },
        user: async (_, { oid }) => {
            return userService.getUser(oid)
        },
        users: async () => {
            return userService.getUsers()
        },
    },
    Mutation: {
        createUser: async (_, { name }) => {
            return userService.createUser(name)
        },
    },
}
