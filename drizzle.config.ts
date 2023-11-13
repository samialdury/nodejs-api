import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db/mysql/schema.ts',
    driver: 'mysql2',
    verbose: true,
    dbCredentials: {
        uri: process.env.MYSQL_DATABASE_URL as string,
    },
})
