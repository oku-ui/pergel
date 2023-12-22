// Pergel auto generated please change this file as you wish
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { defaultUserSchema } from '@pergel/nuxt/drizzle/schema/pg'
import { sql } from 'drizzle-orm'

export const user = defaultUserSchema({
  test: varchar('test').notNull(),
})

export const hello = pgTable('hello', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
})
