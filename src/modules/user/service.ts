import type { Context } from '../../api/context.js'
import type { ValidAccountProviders } from '../account-provider/model.js'
import type { UserJwt } from './jwt.js'
import type { User } from './model.js'
import { accountProviderRepo } from '../account-provider/repository.js'
import { jwt } from '../auth/jwt/service.js'
import { id } from '../common/id.js'
import { userRepo } from './repository.js'

async function createJwt(ctx: Context, user: User): Promise<string> {
    const token = jwt.encode<UserJwt>(ctx, {
        payload: {
            email: user.email,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            sub: user.id,
        },
    })

    return token
}

async function decodeJwt(ctx: Context, token: string): Promise<UserJwt> {
    return jwt.decode<UserJwt>(ctx, {
        token,
    })
}

async function getByExternalId(
    ctx: Context,
    externalId: string,
): Promise<User | undefined> {
    return userRepo.getByExternalId(ctx, externalId)
}

async function getByEmail(
    ctx: Context,
    email: string,
): Promise<User | undefined> {
    return userRepo.getByEmail(ctx, email)
}

async function create(
    ctx: Context,
    accountProvider: ValidAccountProviders,
    user: Pick<User, 'email' | 'externalId' | 'name' | 'profileImageUrl'>,
): Promise<User> {
    const userId = id.create()

    const provider = await accountProviderRepo.getByName(ctx, accountProvider)

    if (!provider) {
        throw new Error('Account provider not found')
    }

    return userRepo.create(ctx, {
        ...user,
        accountProviderId: provider.id,
        id: userId,
        lastLoginAt: new Date(),
    })
}

async function updateLastLoginAt(
    ctx: Context,
    userId: string,
    date: Date,
): Promise<void> {
    await userRepo.updateLastLoginAt(ctx, userId, date)
}

export const userService = {
    create,
    createJwt,
    decodeJwt,
    getByEmail,
    getByExternalId,
    updateLastLoginAt,
}
