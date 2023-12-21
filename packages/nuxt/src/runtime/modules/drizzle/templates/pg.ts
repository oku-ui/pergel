import { sql } from 'drizzle-orm'
import { type PgTableFn, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export function defaultUserSchema(column: Parameters<PgTableFn>[1]) {
  return pgTable('user', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    email: varchar('email').unique().notNull(),
    password: varchar('password').notNull(),
    name: varchar('name').notNull(),
    ...column,
  })
}
