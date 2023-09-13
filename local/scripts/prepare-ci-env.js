import path from 'node:path'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'

function getDirname() {
    return path.dirname(new URL(import.meta.url).pathname)
}

function getTestEnvFileLocation(dirname) {
    return path.join(dirname, '..', 'test', '.test.env')
}

function getRandomString(size = 5) {
    return crypto.randomBytes(size).toString('hex')
}

async function main() {
    const dirname = getDirname()
    const testEnvFileLocation = getTestEnvFileLocation(dirname)

    const envFile = await fs.readFile(testEnvFileLocation, 'utf-8')

    const [pgUser, pgPassword, pgDb] = [
        `u_${getRandomString()}`,
        `pw_${getRandomString()}`,
        `db_${getRandomString()}`,
    ]

    const replacedEnvFile = envFile
        .replace(/POSTGRES_USER=""/g, `POSTGRES_USER="${pgUser}"`)
        .replace(/POSTGRES_PASSWORD=""/g, `POSTGRES_PASSWORD="${pgPassword}"`)
        .replace(/POSTGRES_DB=""/g, `POSTGRES_DB="${pgDb}"`)
        .replace(
            /DATABASE_URL="postgres:\/\/\?sslmode=disable"/g,
            `DATABASE_URL="postgres://${pgUser}:${pgPassword}@postgres_test:5432/${pgDb}?sslmode=disable"`,
        )

    await fs.writeFile(testEnvFileLocation, replacedEnvFile)
}

await main()
