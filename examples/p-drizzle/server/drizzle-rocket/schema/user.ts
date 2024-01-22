// Pergel auto generated please change this
import { relations, sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { session } from './session'

export const roleEnum = pgEnum('authRole', ['user', 'admin', 'userAdmin'])

export const user = pgTable('user', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name'),
  email: text('email'),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  provider: text('provider'),
  providerId: text('providerId'),
  authRole: roleEnum('authRole').notNull().default('user'),
  createdAt: timestamp('createdAt', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  updatedAt: timestamp('updatedAt', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const userRelation = relations(user, ({ many }) => ({
  sessions: many(session),
}))

export type User = (typeof user)['$inferSelect']
export type UserInsert = (typeof user)['$inferInsert']
