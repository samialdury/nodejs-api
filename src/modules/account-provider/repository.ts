import { and, eq, isNull } from 'drizzle-orm'
import type { Context } from '../../api/context.js'
import type { AccountProvider, ValidAccountProviders } from './model.js'
import { accountProvider } from '../../db/mysql/schema.js'

export async function getById(
    { mySql }: Context,
    id: string,
): Promise<AccountProvider | undefined> {
    const result = await mySql.query.accountProvider.findFirst({
        where: and(
            eq(accountProvider.id, id),
            isNull(accountProvider.deletedAt),
        ),
    })

    return result
}

export async function getByName(
    { mySql }: Context,
    name: ValidAccountProviders,
): Promise<AccountProvider | undefined> {
    const result = await mySql.query.accountProvider.findFirst({
        where: and(
            eq(accountProvider.name, name),
            isNull(accountProvider.deletedAt),
        ),
    })

    return result
}
