export interface DefaultJWT extends Record<string, unknown> {
    email: string
    name: string
    picture: string
    sub: string
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
    /**
     * The maximum age of the issued JWT in seconds
     *
     * @default 30 * 24 * 60 * 60 // 30 days
     */
    maxAge?: number
    /**
     * The JWT payload
     */
    token: Payload
}

export interface JWTDecodeParams {
    /**
     * The issued JWT to be decoded
     */
    token: string
}
