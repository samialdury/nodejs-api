import { nanoid } from 'nanoid/async'

import * as userRepository from '../user/repository.js'

import type { Project } from './model.js'
import * as repository from './repository.js'

export async function getProject(oid: string): Promise<Project | undefined> {
    return repository.getProjectByOid(oid)
}

export async function getProjects(): Promise<Project[]> {
    return repository.getProjects()
}

export async function getProjectsByOids(oids: string[]): Promise<Project[]> {
    return repository.getProjectsByOids(oids)
}

export async function getProjectsByAuthorOids(
    authorOids: string[],
): Promise<Project[]> {
    const authors = await userRepository.getUsersByOids(authorOids)

    return repository.getProjectsByAuthorOids(
        authors.map((author) => author.oid),
    )
}

export async function createProject(
    name: string,
    authorOid: string,
): Promise<Project> {
    const author = await userRepository.getUserByOid(authorOid)

    if (!author) {
        throw new Error('Author not found')
    }

    const oid = await nanoid(21)

    return repository.createProject({ oid, name, authorOid: author.oid })
}
