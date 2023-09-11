import type { Resolvers } from '../__generated__/resolvers-types.js'
import * as userService from './user/service.js'

export const resolvers: Resolvers = {
    Mutation: {
        createUser: async (_, { name }, context) => {
            return userService.createUser(context, name)
        },
    },
    Query: {
        status: (_, __, context) => {
            return {
                project: context.config.projectName,
                version: context.config.commitSha,
            }
        },
        user: async (_, { oid }, context) => {
            return userService.getUser(context, oid)
        },
        users: async (_, __, context) => {
            return userService.getUsers(context)
        },
    },
}
