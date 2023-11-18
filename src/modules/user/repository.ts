import { eq } from 'drizzle-orm'
import type { MySqlConnection } from '../../db/mysql/connection.js'
import type { NewUser, User } from './model.js'
import { user } from '../../db/mysql/schema.js'

export type UserRepository = ReturnType<typeof newUserRepository>

export function newUserRepository(mySql: MySqlConnection) {
    async function getById(id: string): Promise<User | undefined> {
        const result = await mySql.query.user.findFirst({
            where: (table, { and, eq, isNull }) =>
                and(eq(table.id, id), isNull(table.deletedAt)),
        })

        return result
    }

    async function getByExternalId(
        externalId: string,
    ): Promise<User | undefined> {
        const result = await mySql.query.user.findFirst({
            where: (table, { and, eq, isNull }) =>
                and(eq(table.externalId, externalId), isNull(table.deletedAt)),
        })

        return result
    }

    async function getByEmail(email: string): Promise<User | undefined> {
        const result = await mySql.query.user.findFirst({
            where: (table, { and, eq, isNull }) =>
                and(eq(table.email, email), isNull(table.deletedAt)),
        })

        return result
    }

    async function create(data: NewUser): Promise<User> {
        await mySql.insert(user).values(data)

        return getById(data.id) as Promise<User>
    }

    async function updateLastLoginAt(
        id: string,
        lastLoginAt: Date,
    ): Promise<void> {
        await mySql
            .update(user)
            .set({
                lastLoginAt,
            })
            .where(eq(user.id, id))
    }

    return {
        getById,
        getByExternalId,
        getByEmail,
        create,
        updateLastLoginAt,
    }
}
