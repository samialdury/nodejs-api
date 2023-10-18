import { sql } from 'drizzle-orm'
import { type MySql2Database, drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import type { Config } from '../../config.js'
import type { Logger } from '../../logger.js'
import * as schema from './schema.js'

export type MySqlConnection = MySql2Database<typeof schema>

export async function initMySql(
    config: Config,
    logger: Logger,
): Promise<[MySqlConnection, mysql.Pool]> {
    const pool = mysql.createPool({
        uri: config.mySqlDatabaseUrl,
    })

    const orm = drizzle(pool, {
        schema,
        mode: 'planetscale',
        logger: {
            logQuery: (query, params) => {
                logger.debug({ query, params }, 'Executing MySQL query')
            },
        },
    })

    try {
        await orm.execute(sql`SELECT 1`)
    } catch (err) {
        logger.error({ err }, 'Error during MySQL health check')
        throw err
    }

    return [orm, pool]
}
