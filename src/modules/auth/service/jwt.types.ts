export interface DefaultJWT extends Record<string, unknown> {
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
    /** The JWT payload. */
    token?: Payload
    /** The secret used to encode the Auth.js issued JWT. */
    secret: string
    /**
     * The maximum age of the Auth.js issued JWT in seconds.
     *
     * @default 30 * 24 * 60 * 60 // 30 days
     */
    maxAge?: number
}

export interface JWTDecodeParams {
    /** The Auth.js issued JWT to be decoded */
    token?: string
    /** The secret used to decode the Auth.js issued JWT. */
    secret: string
}
