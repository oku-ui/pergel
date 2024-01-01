import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function createDrizzleConfig(data: {
  schemaPath: string
}) {
  const indexSchema = /* ts */`// Pergel auto generated please change this file as you 
export * from './session'
export * from './user'
`

  const userSchema = /* ts */`// Pergel auto generated please change this 
import { relations, sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { session } from './session'

export const roleEnum = pgEnum('role', ['user', 'admin', 'userAdmin'])

export const user = pgTable('user', {
  id: uuid('id').primaryKey().default(sql\`uuid_generate_v4()\`),
  name: text('name'),
  email: text('email'),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  provider: text('provider'),
  providerId: text('providerId'),
  role: roleEnum('role').notNull().default('user'),
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
`

  const sessionSchema = /* ts */`// Pergel auto generated please change this
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './user'

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  userId: uuid('userId').notNull()
    .references(() => user.id),
})

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export type Session = (typeof session)['$inferSelect']
export type SessionInsert = (typeof session)['$inferInsert']
`

  const path = resolve(data.schemaPath)

  if (!existsSync(path))
    mkdirSync(path, { recursive: true })

  if (!existsSync(resolve(path, 'index.ts'))) {
    writeFileSync(resolve(path, 'index.ts'), indexSchema, {
      encoding: 'utf8',
    })
  }

  if (!existsSync(resolve(path, 'user.ts'))) {
    writeFileSync(resolve(path, 'user.ts'), userSchema, {
      encoding: 'utf8',
    })
  }

  if (!existsSync(resolve(path, 'session.ts'))) {
    writeFileSync(resolve(path, 'session.ts'), sessionSchema, {
      encoding: 'utf8',
    })
  }
}
