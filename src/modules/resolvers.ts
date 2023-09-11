import type { Resolvers } from '../__generated__/resolvers-types.js'
import { config } from '../config.js'
import * as userService from './user/service.js'

export const resolvers: Resolvers = {
    Mutation: {
        createUser: async (_, { name }) => {
            return userService.createUser(name)
        },
    },
    Query: {
        status: () => {
            return {
                project: config.projectName,
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
}
