import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

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

    const envFile = await fs.readFile(testEnvFileLocation, 'utf8')

    const [mySqlRPassword, mySqlUser, mySqlPassword, mySqlDb] = [
        `rpw_${getRandomString()}`,
        `u_${getRandomString()}`,
        `pw_${getRandomString()}`,
        `db_${getRandomString()}`,
    ]

    const replacedEnvFile = envFile
        .replaceAll(
            'MYSQL_ROOT_PASSWORD=""',
            `MYSQL_ROOT_PASSWORD="${mySqlRPassword}"`,
        )
        .replaceAll('MYSQL_USER=""', `MYSQL_USER="${mySqlUser}"`)
        .replaceAll('MYSQL_PASSWORD=""', `MYSQL_PASSWORD="${mySqlPassword}"`)
        .replaceAll('MYSQL_DATABASE=""', `MYSQL_DATABASE="${mySqlDb}"`)
        .replaceAll(
            'MYSQL_DATABASE_URL="mysql://"',
            `MYSQL_DATABASE_URL="mysql://${mySqlUser}:${mySqlPassword}@mysql:3306/${mySqlDb}"`,
        )

    await fs.writeFile(testEnvFileLocation, replacedEnvFile)
}

await main()
