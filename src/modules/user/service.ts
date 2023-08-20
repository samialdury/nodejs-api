import { nanoid } from 'nanoid/async'

import type { User } from './model.js'
import * as repository from './repository.js'

export async function getUser(oid: string): Promise<User | undefined> {
    return repository.getUserByOid(oid)
}

export async function getUsers(): Promise<User[]> {
    return repository.getUsers()
}

export async function createUser(name: string): Promise<User> {
    const oid = await nanoid(21)

    return repository.createUser({ oid, name })
}
