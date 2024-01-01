import { relations } from 'drizzle-orm'
import { date, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { session } from './session'

export const roleEnum = pgEnum('role', ['user', 'admin', 'userAdmin'])

export const user = pgTable('user', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  provider: text('provider'),
  providerId: text('provider_id'),
  role: roleEnum('role').notNull().default('user'),
  createdAt: date('createdAt').notNull(),
  updatedAt: date('updatedAt').notNull(),
})

export const userRelation = relations(user, ({ many }) => ({
  sessions: many(session),
}))

export type User = (typeof user)['$inferSelect']
export type UserInsert = (typeof user)['$inferInsert']
