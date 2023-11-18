import { relations } from 'drizzle-orm'
import {
    char,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/mysql-core'

function cuidColumn(name: string) {
    return char(name, { length: 31 })
}

const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
    deletedAt: timestamp('deleted_at'),
}

export const accountProvider = mysqlTable('account_provider', {
    id: cuidColumn('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    ...timestamps,
})

export const user = mysqlTable('user', {
    id: cuidColumn('id').notNull().primaryKey(),
    accountProviderId: cuidColumn('account_provider_id').notNull(),
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
