import { onExit } from 'gracy'
import { initApi } from './api/bootstrap.js'
import { initConfig } from './config.js'
import { initMySql } from './db/mysql/connection.js'
import { initLogger } from './logger.js'

async function main(): Promise<void> {
    const config = initConfig()
    const logger = initLogger(config)

    const [mySql, mySqlPool] = await initMySql(config, logger)

    const server = await initApi(config, logger, { mySql })

    onExit(
        async () => {
            await server.close()
            await mySqlPool.end()
        },
        { logger },
    )

    await server.listen({
        host: config.host,
        port: config.port,
    })
}

await main()
