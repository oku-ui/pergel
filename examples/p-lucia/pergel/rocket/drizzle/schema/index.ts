// Pergel auto generated please change this file as you wish
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
// This pergel auth feature is not yet implemented. Do not use it. It will be implemented in the future.
import { defaultUserSchema } from '@pergel/nuxt/drizzle/schema/pg'
import { sql } from 'drizzle-orm'

export const user = pgTable('user', {
  ...defaultUserSchema,
})

export const hello = pgTable('hello', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
})
