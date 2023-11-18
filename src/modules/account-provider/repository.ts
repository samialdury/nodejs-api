import type { MySqlConnection } from '../../db/mysql/connection.js'
import type { AccountProvider, ValidAccountProviders } from './model.js'

export type AccountProviderRepository = ReturnType<
    typeof newAccountProviderRepository
>

export function newAccountProviderRepository(mySql: MySqlConnection) {
    async function getById(id: string): Promise<AccountProvider | undefined> {
        const result = await mySql.query.accountProvider.findFirst({
            where: (table, { and, eq, isNull }) =>
                and(eq(table.id, id), isNull(table.deletedAt)),
        })

        return result
    }

    async function getByName(
        name: ValidAccountProviders,
    ): Promise<AccountProvider | undefined> {
        const result = await mySql.query.accountProvider.findFirst({
            where: (table, { and, eq, isNull }) =>
                and(eq(table.name, name), isNull(table.deletedAt)),
        })

        return result
    }

    return {
        getById,
        getByName,
    }
}
