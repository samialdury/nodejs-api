import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import { writeFile } from 'node:fs/promises'
import type { Config } from '../config.js'

export const schemaTags = {
    health: {
        name: 'Healthcheck',
    },
    auth: {
        name: 'Auth',
    },
    user: {
        name: 'User',
    },
} as const

export function getSwaggerOptions(
    config: Config,
): FastifyDynamicSwaggerOptions {
    return {
        mode: 'dynamic',
        refResolver: {
            buildLocalReference(json, _baseUri, _fragment, index) {
                return (json['$id'] as string) || `unknown-${index}`
            },
        },
        openapi: {
            info: {
                title: config.projectName,
                version: config.commitSha,
            },
            servers: [
                {
                    url: 'https://nodejs-api.dev.sami.codes',
                    description: 'Docker development environment',
                },
                {
                    url: 'http://localhost:8080',
                    description: 'Local development environment',
                },
            ],
            tags: Object.values(schemaTags),
        },
    }
}
export function getSwaggerUiOptions(): FastifySwaggerUiOptions {
    return {
        routePrefix: '/docs',
        staticCSP: true,
    }
}

export async function writeOpenApiSpec(yamlString: string) {
    await writeFile('openapi.yaml', yamlString)
}
