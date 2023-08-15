#!/usr/bin/env node
const path = require('node:path')
const fs = require('node:fs/promises')
const { exec } = require('node:child_process')
const { promisify } = require('node:util')

const { Database } = require('sqlite3')
const which = require('which')
const colors = require('colors')

const execAsync = promisify(exec)

const DB_PATH = path.join(__dirname, '..', 'dev.sqlite')
const MIGRATIONS_DIR = path.join(__dirname, 'migrations')

colors.enable()

async function isCmdAvailable(cmd) {
    return !!(await which(cmd, { nothrow: true }))
}

async function runMigrations(direction) {
    const db = new Database(DB_PATH)

    let migrations = await fs.readdir(MIGRATIONS_DIR)

    if (direction === 'up') {
        migrations = migrations.filter((file) => file.endsWith('.up.sql'))
    } else if (direction === 'down') {
        migrations = migrations.filter((file) => file.endsWith('.down.sql'))
    } else {
        throw new Error(`Invalid direction ${direction}`)
    }

    console.log('Running migrations', direction)

    for (const migration of migrations) {
        console.log('\n', migration.cyan, '\n')

        const sqlString = await fs.readFile(
            path.join(MIGRATIONS_DIR, migration),
            {
                encoding: 'utf-8',
            },
        )

        console.log('\nRunning\n\n', sqlString.yellow)

        const queryPromise = new Promise((resolve, _reject) => {
            db.run(sqlString, (err) => {
                console.log('\n')
                if (err) {
                    console.error(err.message.red)
                    process.exit(1)
                } else {
                    console.log('Done'.green)
                    resolve()
                }
            })
        })

        await queryPromise
    }
}

async function createMigration(name) {
    if ((await isCmdAvailable('migrate')) === false) {
        console.error('Please install go-migrate globally to use this command')
        process.exit(1)
    }

    if (!name) {
        console.error('Please provide a name for the migration')
        process.exit(1)
    }

    console.log('Creating migration', name)

    const { stdout, stderr } = await execAsync(
        `migrate create -ext sql -dir db/migrations ${name}`,
    )

    console.log(stdout)
    console.error(stderr)

    console.log('Done'.green)
}

async function main() {
    const [, , ...args] = process.argv

    const validCommands = ['up', 'down', 'create']

    if (args.length === 0 || !validCommands.includes(args[0])) {
        console.error(
            `Invalid command, must be one of ${validCommands.join(', ')}`,
        )
        process.exit(1)
    }

    const cmdMap = new Map([
        ['up', () => runMigrations('up')],
        ['down', () => runMigrations('down')],
        ['create', () => createMigration(args[1])],
    ])

    const cmd = args[0]

    await cmdMap.get(cmd)()
}

main()
