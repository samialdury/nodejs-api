import { createConfig, type EnveySchema, type InferEnveyConfig } from 'envey'
import { z } from 'zod'

function bool(defaultValue: boolean): z.ZodBoolean {
    return z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .default(defaultValue.toString() as never) as unknown as z.ZodBoolean
}

const schema = {
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
    host: {
        env: 'HOST',
        format: z.string().default('0.0.0.0'),
    },
    port: {
        env: 'PORT',
        format: z.coerce.number().int().min(1024).max(65_535).default(8080),
    },
    logRequests: {
        env: 'LOG_REQUESTS',
        format: bool(false),
    },
} satisfies EnveySchema

export type Config = InferEnveyConfig<typeof schema>

export let config: Config

export function initConfig(): void {
    config = createConfig(z, schema, { validate: true })
}
