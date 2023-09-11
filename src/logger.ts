import { pino } from 'pino'
import type { Config } from './config.js'

export type Logger = pino.Logger

export let logger: Logger

export function initLogger(config: Config): void {
    logger = pino({
        level: config.logLevel,
        name: config.projectName,
    })

    logger.debug('Logger initialized')
}
