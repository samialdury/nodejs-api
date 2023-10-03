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

    const [mySqlRPassword, mySqlUser, mySqlPassword, mySqlDb] = [
        `rpw_${getRandomString()}`,
        `u_${getRandomString()}`,
        `pw_${getRandomString()}`,
        `db_${getRandomString()}`,
    ]

    const replacedEnvFile = envFile
        .replace(
            /MYSQL_ROOT_PASSWORD=""/g,
            `MYSQL_ROOT_PASSWORD="${mySqlRPassword}"`,
        )
        .replace(/MYSQL_USER=""/g, `MYSQL_USER="${mySqlUser}"`)
        .replace(/MYSQL_PASSWORD=""/g, `MYSQL_PASSWORD="${mySqlPassword}"`)
        .replace(/MYSQL_DATABASE=""/g, `MYSQL_DATABASE="${mySqlDb}"`)
        .replace(
            /MYSQL_DATABASE_URL="mysql:\/\/"/g,
            `MYSQL_DATABASE_URL="mysql://${mySqlUser}:${mySqlPassword}@mysql-test:3306/${mySqlDb}"`,
        )

    await fs.writeFile(testEnvFileLocation, replacedEnvFile)
}

await main()
