import { randomUUID } from 'node:crypto'
import { hkdf } from '@panva/hkdf'
import { EncryptJWT, jwtDecrypt } from 'jose'
import type { Config } from '../../../config.js'

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

function nowSeconds(): number {
    return Math.trunc(Date.now() / 1000)
}

async function getDerivedEncryptionKey(config: Config): Promise<Uint8Array> {
    const key = await hkdf(
        'sha256',
        config.jwtSecret,
        '',
        `${config.projectName} generated encryption key`,
        32,
    )

    return key
}

export async function encodeJwt<TPayload extends Record<string, unknown>>(
    config: Config,
    { maxAge = DEFAULT_MAX_AGE, payload }: JwtEncodeParams<TPayload>,
): Promise<string> {
    const encryptionSecret = await getDerivedEncryptionKey(config)

    const jwt = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuer(config.projectName)
        .setIssuedAt()
        .setExpirationTime(nowSeconds() + maxAge)
        .setJti(randomUUID())
        .encrypt(encryptionSecret)

    return jwt
}

export async function decodeJwt<TPayload>(
    config: Config,
    { token }: JwtDecodeParams,
): Promise<TPayload> {
    const encryptionSecret = await getDerivedEncryptionKey(config)

    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    })

    return payload as TPayload
}
