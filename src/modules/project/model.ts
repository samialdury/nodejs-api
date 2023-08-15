import type { User } from '../user/model.js'

export interface Project {
    oid: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    authorOid: string

    author: User
}
