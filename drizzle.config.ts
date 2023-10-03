import { Config } from 'drizzle-kit'

export default {
    schema: './src/db/mysql/schema.ts',
    driver: 'mysql2',
    verbose: true,
    dbCredentials: {
        connectionString: process.env.MYSQL_DATABASE_URL as string,
    },
} satisfies Config
