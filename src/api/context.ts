import type { Config } from '../config.js'
import type { MySqlConnection } from '../db/mysql/connection.js'
import type { Logger } from '../logger.js'
import type { UserJwt } from '../modules/user/jwt.js'
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
    auth: {
        github: OAuth2Namespace
    }
    redirect: typeof createRedirect
    request: ServerRequest
    response: typeof createResponse
    server: Server
    user: UserJwt
}
