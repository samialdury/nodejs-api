export type ValidAccountProviders =
    | 'apple'
    | 'facebook'
    | 'github'
    | 'google'
    | 'twitter'

export interface AccountProvider {
    createdAt: Date
    deletedAt: Date | null
    id: number
    name: ValidAccountProviders
    updatedAt: Date
}
