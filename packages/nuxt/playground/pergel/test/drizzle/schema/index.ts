// Pergel auto generated please change this file as you wish
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export * from './session'
export * from './user'

export const hello = pgTable('hello', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
})
