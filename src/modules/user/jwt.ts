export interface UserJwt extends Record<string, unknown> {
    email: string
    name: string
    profileImageUrl: null | string
    sub: string
}
