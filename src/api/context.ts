import type { Config } from '../config.js'
import type { MySqlConnection } from '../db/mysql/connection.js'
import type { Logger } from '../logger.js'
import type { createRedirect, createResponse } from './controller.js'
import type { OAuth2Namespace, Server, ServerRequest } from './server.js'

export interface DatabaseConnections {
    mySql: MySqlConnection
}

export interface Context extends DatabaseConnections {
    config: Config
    logger: Logger
}

export interface ControllerContext extends Context {
    server: Server
    request: ServerRequest
    auth: {
        github: OAuth2Namespace
    }
    response: typeof createResponse
    redirect: typeof createRedirect
}
