import type {
    ConnectionPool,
    SQLQuery,
    ConnectionPoolConfig,
} from '@databases/pg'
import { default as createConnectionPool, sql } from '@databases/pg'

import type { Config } from './config.js'
import { logger, type Logger } from './logger.js'

export { sql } from '@databases/pg'

export let database: ConnectionPool & {
    queryOne: typeof queryOne
    queryMultiple: typeof queryMultiple
}

async function queryOne<T = unknown>(query: SQLQuery): Promise<T | undefined> {
    logger.debug(query, 'Executing query')
    try {
        const [result] = (await database.query(query)) as unknown as T[]

        return result
    } catch (err) {
        logger.error(err, 'Error executing query')
        throw new Error('Error executing query')
    }
}

async function queryMultiple<T = unknown>(query: SQLQuery): Promise<T[]> {
    logger.debug(query, 'Executing query')
    try {
        const result = (await database.query(query)) as unknown as T[]

        return result
    } catch (err) {
        logger.error(err, 'Error executing query')
        throw new Error('Error executing query')
    }
}

export async function initDatabase(
    config: Config,
    logger: Logger,
): Promise<void> {
    // @ts-expect-error Incorrect type definition
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    database = createConnectionPool({
        connectionString: config.databaseUrl,
        bigIntMode: 'bigint',
    } satisfies ConnectionPoolConfig)

    database.queryOne = queryOne
    database.queryMultiple = queryMultiple

    await database.queryOne(sql`
      SELECT 1;
    `)

    logger.debug('Database initialized')
}
