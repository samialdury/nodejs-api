import type { Context } from '../../api/context.js'
import type { AccountProvider, ValidAccountProviders } from './model.js'

async function getById(
    ctx: Context,
    id: number,
): Promise<AccountProvider | undefined> {
    const result = await ctx.db.mySql.queryOne<AccountProvider>(ctx.db.mySql
        .sql`
        SELECT * FROM account_provider WHERE id = ${id} LIMIT 1
    `)

    return result
}

async function getByName(
    ctx: Context,
    name: ValidAccountProviders,
): Promise<AccountProvider | undefined> {
    const result = await ctx.db.mySql.queryOne<AccountProvider>(ctx.db.mySql
        .sql`
        SELECT * FROM account_provider WHERE name = ${name} LIMIT 1
    `)

    return result
}

export const accountProviderRepo = {
    getById,
    getByName,
}
