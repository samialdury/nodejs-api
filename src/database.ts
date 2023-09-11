/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
    ConnectionPool,
    ConnectionPoolConfig,
    SQLQuery,
} from '@databases/pg'
import { default as createConnectionPool, sql } from '@databases/pg'
import type { Config } from './config.js'
import { type Logger, logger } from './logger.js'

export { sql } from '@databases/pg'

let pool: ConnectionPool

// @databases/pg doesn't support generics, so this is a workaround for now
export const database = {
    queryMultiple: async <T = unknown>(query: SQLQuery): Promise<T[]> => {
        logger.debug(query, 'Executing query')
        try {
            const result = await pool.query(query)

            return result as unknown as T[]
        } catch (err) {
            logger.error(err, 'Error executing query')
            throw new Error('Error executing query')
        }
    },
    queryOne: async <T = unknown>(query: SQLQuery): Promise<T | undefined> => {
        logger.debug(query, 'Executing query')
        try {
            const [result] = await pool.query(query)

            return result as unknown as T | undefined
        } catch (err) {
            logger.error(err, 'Error executing query')
            throw new Error('Error executing query')
        }
    },
}

export async function initDatabase(
    config: Config,
    logger: Logger,
): Promise<void> {
    // @ts-expect-error Types are not inferred correctly
    pool = createConnectionPool({
        bigIntMode: 'bigint',
        connectionString: config.databaseUrl,
        onConnectionClosed: () => {
            logger.debug('DB connection closed')
        },
        onConnectionOpened: () => {
            logger.debug('DB connection opened')
        },
        onQueryError: (_query, formattedQuery, err) => {
            logger.error({ err, formattedQuery }, 'Error executing DB query')
        },
        onQueryStart: (_query, formattedQuery) => {
            logger.trace({ formattedQuery }, 'Executing DB query')
        },
    } satisfies ConnectionPoolConfig)

    await database.queryOne(sql`
      SELECT 1;
    `)

    logger.debug('Database initialized')
}
