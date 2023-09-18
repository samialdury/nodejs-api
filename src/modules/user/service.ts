import { typeid } from 'typeid-js'
import type { Context } from '../../api/types.js'
import type { User } from './model.js'
import * as repository from './repository.js'

export async function getUser(
    context: Context,
    oid: string,
): Promise<User | undefined> {
    return repository.getUserByOid(context.database, oid)
}

export async function getUsers(context: Context): Promise<User[]> {
    return repository.getUsers(context.database)
}

export async function createUser(
    context: Context,
    name: User['name'],
): Promise<User> {
    const oid = typeid('user').toString()

    return repository.createUser(context.database, { name, oid })
}
