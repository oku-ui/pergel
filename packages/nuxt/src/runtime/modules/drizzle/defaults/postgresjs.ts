import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function createDrizzleConfig(data: {
  schemaPath: string
}) {
  const indexSchema = /* ts */`// Pergel auto generated please change this file as you wish
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { defaultUserSchema } from '@pergel/nuxt/drizzle/schema/pg'
import { sql } from 'drizzle-orm'

export const user = defaultUserSchema({})

export const hello = pgTable('hello', {
  id: uuid('id').primaryKey().default(sql\`uuid_generate_v4()\`),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  name: varchar('name').notNull(),
})
`

  const path = resolve(data.schemaPath)

  if (!existsSync(path))
    mkdirSync(path, { recursive: true, mode: 0o777 })

  if (!existsSync(resolve(path, 'index.ts'))) {
    writeFileSync(resolve(path, 'index.ts'), indexSchema, {
      mode: 0o777,
      encoding: 'utf8',
      flag: 'w',
    })
  }
}
