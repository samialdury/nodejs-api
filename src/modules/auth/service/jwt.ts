import { randomUUID } from 'node:crypto'
import { hkdf } from '@panva/hkdf'
import { EncryptJWT, jwtDecrypt } from 'jose'
import type { Context } from '../../../api/types.js'
import type { JWT, JWTDecodeParams, JWTEncodeParams } from './jwt.types.js'

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function now(): number {
    return Math.trunc(Date.now() / 1000)
}

export async function encodeJWT<Payload = JWT>(
    context: Context,
    params: JWTEncodeParams<Payload>,
): Promise<string> {
    const { maxAge = DEFAULT_MAX_AGE, token = {} } = params
    const encryptionSecret = await getDerivedEncryptionKey(
        context.config.jwtSecret,
    )

    // @ts-expect-error `jose` allows any object as payload.
    const jwt = await new EncryptJWT(token)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer(context.config.projectName)
        .setIssuedAt()
        .setExpirationTime(now() + maxAge)
        .setJti(randomUUID())
        .encrypt(encryptionSecret)

    return jwt
}

export async function decodeJWT<Payload = JWT>(
    context: Context,
    params: JWTDecodeParams,
): Promise<Payload | undefined> {
    const { token } = params

    if (!token) {
        return undefined
    }

    const encryptionSecret = await getDerivedEncryptionKey(
        context.config.jwtSecret,
    )

    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    })

    return payload as Payload
}

async function getDerivedEncryptionKey(secret: string): Promise<Uint8Array> {
    const key = await hkdf(
        'sha256',
        secret,
        '',
        'Auth.js Generated Encryption Key',
        32,
    )

    return key
}
