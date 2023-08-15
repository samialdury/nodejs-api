import { pino } from 'pino'

import type { Config } from './config.js'

export type Logger = pino.Logger

export let logger: Logger

export function initLogger(config: Config): void {
    logger = pino({
        name: config.projectName,
        level: config.logLevel,
    })

    logger.debug('Logger initialized')
}
