import { eq } from 'drizzle-orm'
import type { Context } from '../../api/context.js'
import type { AccountProvider, ValidAccountProviders } from './model.js'

async function getById(
    { mySql }: Context,
    id: number,
): Promise<AccountProvider | undefined> {
    const result = await mySql.query.accountProvider.findFirst({
        where: eq(mySql.schema.accountProvider.id, id),
    })

    return result
}

async function getByName(
    { mySql }: Context,
    name: ValidAccountProviders,
): Promise<AccountProvider | undefined> {
    const result = await mySql.query.accountProvider.findFirst({
        where: eq(mySql.schema.accountProvider.name, name),
    })

    return result
}

export const accountProviderRepo = {
    getById,
    getByName,
}
