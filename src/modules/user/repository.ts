import { and, eq, isNull } from 'drizzle-orm'
import type { Context } from '../../api/context.js'
import type { NewUser, User } from './model.js'
import { user } from '../../db/mysql/schema.js'

export async function getById(
    { mySql }: Context,
    id: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: and(eq(user.id, id), isNull(user.deletedAt)),
    })

    return result
}

export async function getByExternalId(
    { mySql }: Context,
    externalId: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: and(eq(user.externalId, externalId), isNull(user.deletedAt)),
    })

    return result
}

export async function getByEmail(
    { mySql }: Context,
    email: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: and(eq(user.email, email), isNull(user.deletedAt)),
    })

    return result
}

export async function create(ctx: Context, data: NewUser): Promise<User> {
    await ctx.mySql.insert(user).values(data)

    return getById(ctx, data.id) as Promise<User>
}

export async function updateLastLoginAt(
    { mySql }: Context,
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
