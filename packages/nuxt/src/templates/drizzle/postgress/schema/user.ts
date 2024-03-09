// Pergel auto generated please change this
import { relations, sql } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { session } from './session'

export const roleStatusEnum = pgEnum('role_status_enum', ['user', 'admin', 'superAdmin'])

const ROLE_STATUS = roleStatusEnum.enumValues
export type RoleStatus = (typeof ROLE_STATUS)[number]

export const user = pgTable('user', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name'),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  provider: text('provider'),
  providerId: text('providerId'),
  roleStatus: roleStatusEnum('roleStatus').notNull().default('user'),
  token: varchar('token', { length: 32 }).notNull().unique(),
  active: boolean('active').notNull().default(false),
  loggedInAt: timestamp('loggedInAt', {
    withTimezone: true,
    mode: 'date',
  }),
  createdAt: timestamp('createdAt', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow().notNull(),
})

export const userRelation = relations(user, ({ many }) => ({
  sessions: many(session),
}))

export type User = (typeof user)['$inferSelect']
export type UserInsert = (typeof user)['$inferInsert']
