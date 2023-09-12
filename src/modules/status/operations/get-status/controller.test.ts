import type { Static } from '@sinclair/typebox'
import assert from 'node:assert/strict'
import test from 'node:test'
import type { Server } from '../../../../api/types.js'
import type { schema } from './schema.js'
import { initApi } from '../../../../api/bootstrap.js'
import { Status } from '../../../../api/constants.js'
import { type Config, initConfig } from '../../../../config.js'
import { type Logger, initLogger } from '../../../../logger.js'

await test('Status controller', async (t) => {
    let config: Config
    let logger: Logger
    let server: Server

    t.beforeEach(async () => {
        config = initConfig()
        logger = initLogger(config)
        server = await initApi(config, logger, {} as never)
    })

    t.afterEach(async () => {
        await server.close()
        config = undefined as never
        logger = undefined as never
        server = undefined as never
    })

    await t.test('Should return status response', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/status',
        })

        const json =
            response.json<Static<(typeof schema)['response'][`${Status.OK}`]>>()

        assert.equal(response.statusCode, Status.OK)
        assert.deepEqual(json, {
            project: config.projectName,
            version: config.commitSha,
        })
    })
})
