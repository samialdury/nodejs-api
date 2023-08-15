import { database, sql } from '../../database.js'

import type { Project } from './model.js'

export async function getProjectByOid(
    oid: string,
): Promise<Project | undefined> {
    const project = await database.queryOne<Project>(sql`
      SELECT * FROM project WHERE oid = ${oid}
        AND deletedAt IS NULL
      LIMIT 1;
    `)

    return project
}

export async function getProjects(): Promise<Project[]> {
    const projects = await database.queryMultiple<Project>(sql`
      SELECT * FROM project WHERE deletedAt IS NULL
      ORDER BY createdAt DESC;
    `)

    return projects
}

export async function getProjectsByOids(oids: string[]): Promise<Project[]> {
    const projects = await database.queryMultiple<Project>(sql`
      SELECT * FROM project WHERE oid IN (${oids.join(', ')})
        AND deletedAt IS NULL
      ORDER BY createdAt DESC;
    `)

    return projects
}

export async function getProjectsByAuthorOids(
    authorOids: string[],
): Promise<Project[]> {
    const projects = await database.queryMultiple<Project>(sql`
      SELECT * FROM project WHERE authorOid IN (${authorOids.join(', ')})
        AND deletedAt IS NULL
      ORDER BY createdAt DESC;
    `)

    return projects
}

export async function createProject({
    oid,
    name,
    authorOid,
}: Omit<
    Project,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'author'
>): Promise<Project> {
    const now = new Date().toISOString()

    await database.queryOne(sql`
      INSERT INTO project (oid, name, authorOid, createdAt, updatedAt) VALUES (${oid}, ${name}, ${authorOid}, ${now}, ${now});
    `)

    const project = await getProjectByOid(oid)

    if (!project) {
        throw new Error('Project not found')
    }

    return project
}
