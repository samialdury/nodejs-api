import { randomUUID } from 'node:crypto'
import { hkdf } from '@panva/hkdf'
import { EncryptJWT, jwtDecrypt } from 'jose'
import type { Context } from '../../../api/context.js'

export interface JwtEncodeParams<TPayload extends Record<string, unknown>> {
    /**
     * The maximum age of the issued JWT in seconds
     *
     * @default 30 * 24 * 60 * 60 // 30 days
     */
    maxAge?: number
    /**
     * The JWT payload
     */
    payload: TPayload
}

export interface JwtDecodeParams {
    /**
     * The issued JWT to be decoded
     */
    token: string
}

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function now(): number {
    return Math.trunc(Date.now() / 1000)
}

async function encode<TPayload extends Record<string, unknown>>(
    ctx: Context,
    { maxAge = DEFAULT_MAX_AGE, payload }: JwtEncodeParams<TPayload>,
): Promise<string> {
    const encryptionSecret = await getDerivedEncryptionKey(ctx)

    const jwt = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer(ctx.config.projectName)
        .setIssuedAt()
        .setExpirationTime(now() + maxAge)
        .setJti(randomUUID())
        .encrypt(encryptionSecret)

    return jwt
}

async function decode<TPayload>(
    ctx: Context,
    { token }: JwtDecodeParams,
): Promise<TPayload> {
    const encryptionSecret = await getDerivedEncryptionKey(ctx)

    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    })

    return payload as TPayload
}

async function getDerivedEncryptionKey(ctx: Context): Promise<Uint8Array> {
    const key = await hkdf(
        'sha256',
        ctx.config.jwtSecret,
        '',
        `${ctx.config.projectName} Generated Encryption Key`,
        32,
    )

    return key
}

export const jwt = {
    decode,
    encode,
}
