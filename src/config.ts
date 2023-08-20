import { createConfig, type EnveySchema, type InferEnveyConfig } from 'envey'
import { z } from 'zod'

function bool(defaultValue: boolean): z.ZodBoolean {
    return z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .default(defaultValue.toString() as never) as unknown as z.ZodBoolean
}

const DEFAULT_PORT = 8080

const schema = {
    // Common
    commitSha: {
        env: 'COMMIT_SHA',
        format: z.string(),
    },
    nodeEnv: {
        env: 'NODE_ENV',
        format: z.enum(['production', 'test', 'development']),
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
    projectName: {
        env: 'PROJECT_NAME',
        format: z.string(),
    },
    // API
    host: {
        env: 'HOST',
        format: z.string().default('0.0.0.0'),
    },
    port: {
        env: 'PORT',
        format: z.coerce
            .number()
            .int()
            .min(1024)
            .max(65_535)
            .default(DEFAULT_PORT),
    },
    logRequests: {
        env: 'LOG_REQUESTS',
        format: bool(false),
    },
    publicHost: {
        env: 'PUBLIC_HOST',
        format: z
            .string()
            .default(`http://localhost:${process.env['PORT'] ?? DEFAULT_PORT}`),
    },
    // Database
    databaseUrl: {
        env: 'DATABASE_URL',
        format: z.string(),
    },
    // Auth
    jwtSecret: {
        env: 'JWT_SECRET',
        format: z.string(),
    },
    // GitHub
    githubLoginPath: {
        env: 'GITHUB_LOGIN_PATH',
        format: z.string().default('/login/github'),
    },
    githubClientId: {
        env: 'GITHUB_CLIENT_ID',
        format: z.string(),
    },
    githubClientSecret: {
        env: 'GITHUB_CLIENT_SECRET',
        format: z.string(),
    },
} satisfies EnveySchema

export type Config = InferEnveyConfig<typeof schema>

export let config: Config

export function initConfig(): void {
    config = createConfig(z, schema, { validate: true })
}
