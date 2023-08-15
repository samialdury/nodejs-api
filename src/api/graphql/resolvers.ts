import type { Resolvers } from '../../__generated__/resolvers-types.js'
import { config } from '../../config.js'
import * as projectService from '../../modules/project/service.js'
import * as userService from '../../modules/user/service.js'

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
        project: async (_, { oid }) => {
            return projectService.getProject(oid)
        },
        projects: async () => {
            return projectService.getProjects()
        },
    },
    Mutation: {
        createUser: async (_, { name }) => {
            return userService.createUser(name)
        },
        createProject: async (_, { name, authorOid }) => {
            return projectService.createProject(name, authorOid)
        },
    },
}

// export const loaders = {
//     User: {
//         projects: async (queries) => {
//             const authorOids = queries.map((query) => query.obj.oid)

//             const projects = await projectService.getProjectsByAuthorOids(
//                 authorOids,
//             )

//             return queries.map((query) =>
//                 projects.filter(
//                     (project) => project.authorOid === query.obj.oid,
//                 ),
//             )
//         },
//     },
//     Project: {
//         author: async (queries) => {
//             const projectOids = queries.map((query) => query.obj.oid)

//             const authors = await userService.getUsersByProjectOids(projectOids)

//             return queries.map(
//                 (query) =>
//                     authors.find(
//                         (author) => author.oid === query.obj.authorOid,
//                     ) ?? new Error('Author not found'),
//             )
//         },
//     },
// }
