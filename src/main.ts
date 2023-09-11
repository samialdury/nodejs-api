import { initApi } from './api/bootstrap.js'
import { config, initConfig } from './config.js'
import { initDatabase } from './database.js'
import { initLogger, logger } from './logger.js'

async function main(): Promise<void> {
    initConfig()
    initLogger(config)

    await initDatabase(config, logger)

    await initApi(config, logger)
}

await main()
