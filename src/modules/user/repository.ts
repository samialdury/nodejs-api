import type { User } from './model.js'
import { type Database, sql } from '../../database.js'

export async function getUserByOid(
    database: Database,
    oid: User['oid'],
): Promise<User | undefined> {
    const user = await database.queryOne<User>(sql`
      SELECT * FROM user WHERE oid = ${oid}
        AND deletedAt IS NULL
      LIMIT 1;
    `)

    return user
}

export async function getUsers(database: Database): Promise<User[]> {
    const users = await database.queryMultiple<User>(sql`
      SELECT * FROM user WHERE deletedAt IS NULL
      ORDER BY createdAt DESC;
    `)

    return users
}

export async function getUsersByOids(
    database: Database,
    oids: User['oid'][],
): Promise<User[]> {
    const users = await database.queryMultiple<User>(sql`
      SELECT * FROM user WHERE oid IN (${oids.join(', ')})
        AND deletedAt IS NULL
      ORDER BY createdAt DESC;
    `)

    return users
}

export async function createUser(
    database: Database,
    { name, oid }: Omit<User, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>,
): Promise<User> {
    const now = new Date().toISOString()

    await database.queryOne(sql`
      INSERT INTO user (oid, name, createdAt, updatedAt) VALUES (${oid}, ${name}, ${now}, ${now});
    `)

    const user = await getUserByOid(database, oid)

    if (!user) {
        throw new Error('User not found')
    }

    return user
}
