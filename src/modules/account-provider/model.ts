import type { accountProvider } from '../../db/mysql/schema.js'

export type ValidAccountProviders =
    | 'apple'
    | 'facebook'
    | 'github'
    | 'google'
    | 'twitter'

export type AccountProvider = typeof accountProvider.$inferSelect

export type NewAccountProvider = typeof accountProvider.$inferInsert
