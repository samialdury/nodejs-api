import type { Config } from '../../config.js'
import type { ValidAccountProviders } from '../account-provider/model.js'
import type { AccountProviderRepository } from '../account-provider/repository.js'
import type { UserJwt } from './jwt.js'
import type { User } from './model.js'
import type { UserRepository } from './repository.js'
import { encodeJwt } from '../auth/jwt/service.js'
import { createId } from '../common/id.js'

export type UserService = ReturnType<typeof newUserService>

export function newUserService(
    config: Config,
    userRepo: UserRepository,
    accountProviderRepo: AccountProviderRepository,
) {
    async function createJwt(user: User): Promise<string> {
        const token = encodeJwt<UserJwt>(config, {
            payload: {
                email: user.email,
                name: user.name,
                profileImageUrl: user.profileImageUrl,
                sub: user.id,
            },
        })
        return token
    }

    async function getByExternalId(
        externalId: string,
    ): Promise<User | undefined> {
        return userRepo.getByExternalId(externalId)
    }

    async function getByEmail(email: string): Promise<User | undefined> {
        return userRepo.getByEmail(email)
    }

    async function create(
        accountProvider: ValidAccountProviders,
        user: Pick<User, 'email' | 'externalId' | 'name' | 'profileImageUrl'>,
    ): Promise<User> {
        const userId = createId()

        const provider = await accountProviderRepo.getByName(accountProvider)

        if (!provider) {
            throw new Error('Account provider not found')
        }

        return userRepo.create({
            ...user,
            accountProviderId: provider.id,
            id: userId,
            lastLoginAt: new Date(),
        })
    }

    async function updateLastLoginAt(
        userId: string,
        date: Date,
    ): Promise<void> {
        await userRepo.updateLastLoginAt(userId, date)
    }

    return {
        createJwt,
        getByExternalId,
        getByEmail,
        create,
        updateLastLoginAt,
    }
}
