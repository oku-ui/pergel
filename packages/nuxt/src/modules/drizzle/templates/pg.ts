import { sql } from 'drizzle-orm'
import { uuid, varchar } from 'drizzle-orm/pg-core'

export const defaultUserSchema = {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
}
