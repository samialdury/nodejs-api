export interface User {
    accountProviderId: number
    createdAt: Date
    deletedAt: Date | null
    displayName: null | string
    email: string
    externalId: null | string
    id: string
    lastLoginAt: null | string
    name: string
    profileImageUrl: null | string
    updatedAt: Date
}
