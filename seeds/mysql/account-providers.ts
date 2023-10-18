import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { initConfig } from '../../src/config.js'
import { initMySql } from '../../src/db/mysql/connection.js'
import { accountProvider } from '../../src/db/mysql/schema.js'
import { initLogger } from '../../src/logger.js'

async function main(): Promise<void> {
    const config = initConfig()
    const logger = initLogger(config)
    const [mySql, mySqlPool] = await initMySql(config, logger)

    try {
        await mySql
            .insert(accountProvider)
            .values(
                [
                    {
                        name: 'github',
                    },
                    {
                        name: 'google',
                    },
                    {
                        name: 'facebook',
                    },
                    {
                        name: 'apple',
                    },
                    {
                        name: 'twitter',
                    },
                ].map((provider) => ({
                    ...provider,
                    id: createId(),
                })),
            )
            .onDuplicateKeyUpdate({
                set: {
                    id: sql`id`,
                },
            })

        logger.info('Seed ran successfully')
    } catch (err) {
        logger.error({ err }, 'Error during seed')
        throw err
    } finally {
        await mySqlPool.end()
    }
}

await main()
