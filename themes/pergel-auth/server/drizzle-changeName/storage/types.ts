import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export interface API {
  db: PostgresJsDatabase
}
