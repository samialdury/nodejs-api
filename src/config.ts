import { type EnveySchema, type InferEnveyConfig, createConfig } from 'envey'
import { z } from 'zod'

function bool(defaultValue: boolean): z.ZodBoolean {
    return z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .default(defaultValue.toString() as never) as unknown as z.ZodBoolean
}

const schema = {
    // Common
    commitSha: {
        env: 'COMMIT_SHA',
        format: z.string(),
    },
    // Database
    databaseUrl: {
        env: 'DATABASE_URL',
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
    // GitHub
    githubLoginPath: {
        env: 'GITHUB_LOGIN_PATH',
        format: z.string().default('/login/github'),
    },
    // API
    host: {
        env: 'INTERNAL_HOST',
        format: z.string().default('0.0.0.0'),
    },
    // Auth
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
        format: bool(false),
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
        env: 'HOST',
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
