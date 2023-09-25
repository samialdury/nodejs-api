/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
    ConnectionPool,
    ConnectionPoolConfig,
    SQLQuery,
} from '@databases/mysql'
import { default as createConnectionPool, sql } from '@databases/mysql'
import type { Config } from '../config.js'
import type { Logger } from '../logger.js'

let pool: ConnectionPool

export interface MySqlConnection extends ConnectionPool {
    healthCheck: () => Promise<void>
    queryMultiple: <T = unknown>(query: SQLQuery) => Promise<T[]>
    queryOne: <T = unknown>(query: SQLQuery) => Promise<T | undefined>
    sql: typeof sql
}

export async function initMySql(
    config: Config,
    logger: Logger,
): Promise<MySqlConnection> {
    const pattern = new RegExp(
        /^mysql:\/\/([^:@]+:[^:@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?multiStatements=true$/,
    )
    const replacement = 'mysql://$1@$2:$3/$4'
    const connectionString = config.mySqlDatabaseUrl.replace(
        pattern,
        replacement,
    )

    // @ts-expect-error Types are not inferred correctly
    pool = createConnectionPool({
        bigIntMode: 'bigint',
        connectionString,
        onConnectionClosed: () => {
            logger.debug('MySQL connection closed')
        },
        onConnectionOpened: () => {
            logger.debug('MySQL connection opened')
        },
        onQueryError: (_query, formattedQuery, err) => {
            logger.error({ err, formattedQuery }, 'Error executing MySQL query')
        },
        onQueryStart: (_query, formattedQuery) => {
            logger.trace({ formattedQuery }, 'Executing MySQL query')
        },
    } satisfies ConnectionPoolConfig)

    // @databases/mysql doesn't support generics, so this is a workaround for now
    const mySql: MySqlConnection = Object.assign(pool, {
        healthCheck: async () => {
            await pool.query(sql`
              SELECT 1;
            `)
        },
        queryMultiple: async <T = unknown>(query: SQLQuery): Promise<T[]> => {
            try {
                const result = await pool.query(query)

                return result as unknown as T[]
            } catch {
                throw new Error('Error executing MySQL query')
            }
        },
        queryOne: async <T = unknown>(
            query: SQLQuery,
        ): Promise<T | undefined> => {
            try {
                const [result] = await pool.query(query)

                return result as unknown as T | undefined
            } catch {
                throw new Error('Error executing MySQL query')
            }
        },
        sql,
    })

    await mySql.healthCheck()

    logger.debug('MySQL initialized')

    return mySql
}
