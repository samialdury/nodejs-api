import { relations } from 'drizzle-orm'
import {
    char,
    mysqlTable,
    text,
    timestamp,
    tinyint,
    varchar,
} from 'drizzle-orm/mysql-core'

const cuidColumn = char('id', { length: 31 })

const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
    deletedAt: timestamp('deleted_at'),
}

export const accountProvider = mysqlTable('account_provider', {
    id: tinyint('id').notNull().primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    ...timestamps,
})

export const user = mysqlTable('user', {
    id: cuidColumn.notNull().primaryKey(),
    accountProviderId: tinyint('account_provider_id').notNull(),
    externalId: varchar('external_id', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }),
    profileImageUrl: text('profile_image_url'),
    lastLoginAt: timestamp('last_login_at'),
    ...timestamps,
})

export const userRelations = relations(user, ({ one }) => {
    return {
        accountProvider: one(accountProvider, {
            fields: [user.accountProviderId],
            references: [accountProvider.id],
        }),
    }
})
