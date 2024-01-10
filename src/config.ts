import {
    type EnveySchema,
    type InferEnveyConfig,
    bool,
    createConfig,
} from 'envey'
import { z } from 'zod'
import { BaseError } from './errors/base-error.js'

const schema = {
    commitSha: {
        env: 'COMMIT_SHA',
        format: z.string().default('unknown'),
    },
    logLevel: {
        env: 'LOG_LEVEL',
        format: z
            .enum([
                'fatal',
                'error',
                'warn',
                'info',
                'debug',
                'trace',
                'silent',
            ])
            .default('info'),
    },
    projectName: {
        env: 'PROJECT_NAME',
        format: z.string().default('nodejs-api'),
    },
    env: {
        env: 'ENV',
        format: z.enum(['prod', 'dev', 'test']).default('prod'),
    },
    cookieSecret: {
        env: 'COOKIE_SECRET',
        format: z.string().min(16),
    },
    githubClientId: {
        env: 'GITHUB_CLIENT_ID',
        format: z.string(),
    },
    githubClientSecret: {
        env: 'GITHUB_CLIENT_SECRET',
        format: z.string(),
    },
    githubLoginPath: {
        env: 'GITHUB_LOGIN_PATH',
        format: z.string().default('/login/github'),
    },
    host: {
        env: 'INTERNAL_HOST',
        format: z.string().default('0.0.0.0'),
    },
    internalHost: {
        env: 'INTERNAL_HOST',
        format: z.string().default('0.0.0.0'),
    },
    jwtSecret: {
        env: 'JWT_SECRET',
        format: z.string().min(16),
    },
    logRequests: {
        env: 'LOG_REQUESTS',
        format: bool(z, false),
    },
    mySqlDatabaseUrl: {
        env: 'MYSQL_DATABASE_URL',
        format: z.string(),
    },
    port: {
        env: 'PORT',
        format: z.coerce.number().int().min(1024).max(65_535).default(8080),
    },
    requestBodyLimitBytes: {
        env: 'REQUEST_BODY_LIMIT_BYTES',
        format: z.coerce.number().int().min(1).default(1_048_576), // 1 MiB
    },
    publicHost: {
        env: 'PUBLIC_HOST',
        format: z.string(),
    },
    debugMode: {
        env: 'DEBUG_MODE',
        format: bool(z, false),
    },
} satisfies EnveySchema

export type Config = InferEnveyConfig<typeof schema>

class ConfigError extends BaseError {
    constructor(message: string) {
        super(message, false)
    }
}

export function initConfig(): Config {
    const result = createConfig(z, schema, { validate: true })

    if (!result.success) {
        // eslint-disable-next-line no-console
        console.error(result.error.issues)
        throw new ConfigError('Invalid configuration')
    }

    return result.config
}
