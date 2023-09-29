import {
    type EnveySchema,
    type InferEnveyConfig,
    bool,
    createConfig,
} from 'envey'
import { z } from 'zod'

const schema = {
    commitSha: {
        env: 'COMMIT_SHA',
        format: z.string(),
    },
    cookieSecret: {
        env: 'COOKIE_SECRET',
        format: z.string(),
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
        format: z.string(),
    },
    logLevel: {
        env: 'LOG_LEVEL',
        format: z.enum([
            'fatal',
            'error',
            'warn',
            'info',
            'debug',
            'trace',
            'silent',
        ]),
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
    projectName: {
        env: 'PROJECT_NAME',
        format: z.string(),
    },
    publicHost: {
        env: 'PUBLIC_HOST',
        format: z.string(),
    },
} satisfies EnveySchema

export type Config = InferEnveyConfig<typeof schema>

export function initConfig(): Config {
    const result = createConfig(z, schema, { validate: true })

    if (!result.success) {
        // eslint-disable-next-line no-console
        console.error(result.error.issues)
        throw new Error('Invalid config')
    }

    return result.config
}
