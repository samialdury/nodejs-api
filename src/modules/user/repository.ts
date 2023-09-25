import type { Context } from '../../api/context.js'
import type { User } from './model.js'

async function getById(ctx: Context, id: string): Promise<User | undefined> {
    const result = await ctx.db.mySql.queryOne<User>(ctx.db.mySql.sql`
        SELECT * FROM user WHERE id = ${id} LIMIT 1
    `)

    return result
}

async function getByExternalId(
    ctx: Context,
    externalId: number,
): Promise<User | undefined> {
    const result = await ctx.db.mySql.queryOne<User>(ctx.db.mySql.sql`
        SELECT * FROM user WHERE externalId = ${externalId} LIMIT 1
    `)

    return result
}

async function getByEmail(
    ctx: Context,
    email: string,
): Promise<User | undefined> {
    const result = await ctx.db.mySql.queryOne<User>(ctx.db.mySql.sql`
        SELECT * FROM user WHERE email = ${email} LIMIT 1
    `)

    return result
}

async function create(
    ctx: Context,
    user: Pick<
        User,
        | 'accountProviderId'
        | 'email'
        | 'externalId'
        | 'id'
        | 'name'
        | 'profileImageUrl'
    >,
): Promise<User> {
    await ctx.db.mySql.query(ctx.db.mySql.sql`
        INSERT INTO user 
            (id, accountProviderId, externalId, email, name, profileImageUrl)
        VALUES (
            ${user.id},
            ${user.accountProviderId},
            ${user.externalId},
            ${user.email},
            ${user.name},
            ${user.profileImageUrl}
        )
    `)

    return getById(ctx, user.id) as Promise<User>
}

export const userRepo = {
    create,
    getByEmail,
    getByExternalId,
    getById,
}
