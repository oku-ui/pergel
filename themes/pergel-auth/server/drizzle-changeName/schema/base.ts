import { sql } from 'drizzle-orm'
import { timestamp, uuid } from 'drizzle-orm/pg-core'

export function baseModel() {
  return {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    createdAt: timestamp('createdAt', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow().notNull(),
  }
}

export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date
}
