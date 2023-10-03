import type { user } from '../../db/mysql/schema.js'

export type User = typeof user.$inferSelect

export type NewUser = typeof user.$inferInsert
