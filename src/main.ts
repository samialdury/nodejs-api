import { onExit } from 'gracy'
import { initApi } from './api/bootstrap.js'
import { initConfig } from './config.js'
import { initDatabase } from './database.js'
import { initLogger } from './logger.js'

async function main(): Promise<void> {
    const config = initConfig()
    const logger = initLogger(config)

    const database = await initDatabase(config, logger)

    const server = await initApi(config, logger, database)

    onExit({ logger }, async () => {
        await server.close()
        await database.close()
    })

    await server.listen({
        host: config.host,
        port: config.port,
    })
}

await main()
