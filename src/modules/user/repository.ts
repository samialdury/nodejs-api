import { eq } from 'drizzle-orm'
import type { Context } from '../../api/context.js'
import type { NewUser, User } from './model.js'

async function getById(
    { mySql }: Context,
    id: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: eq(mySql.schema.user.id, id),
    })

    return result
}

async function getByExternalId(
    { mySql }: Context,
    externalId: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: eq(mySql.schema.user.externalId, externalId),
    })

    return result
}

async function getByEmail(
    { mySql }: Context,
    email: string,
): Promise<User | undefined> {
    const result = await mySql.query.user.findFirst({
        where: eq(mySql.schema.user.email, email),
    })

    return result
}

async function create(ctx: Context, user: NewUser): Promise<User> {
    await ctx.mySql.insert(ctx.mySql.schema.user).values(user)

    return getById(ctx, user.id) as Promise<User>
}

async function updateLastLoginAt(
    { mySql }: Context,
    id: string,
    lastLoginAt: Date,
): Promise<void> {
    await mySql
        .update(mySql.schema.user)
        .set({
            lastLoginAt,
        })
        .where(eq(mySql.schema.user.id, id))
}

export const userRepo = {
    create,
    getByEmail,
    getByExternalId,
    getById,
    updateLastLoginAt,
}
