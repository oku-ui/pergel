import { resolve } from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'

config()

const dbUrl = process.env.NUXT_TEST_DRIZZLE_URL

const migrationDir = resolve('/Users/productdevbook/works/pergel/packages/nuxt/playground/server/drizzle-test/migrations')

async function rundevMigration() {
  if (!dbUrl)
    throw new Error('NUXT_PZG_DRIZZLE_URL must be set')

  const queryClient = postgres(dbUrl, {
    onnotice: () => { },
    connection: {
      TimeZone: 'UTC',
    },
    max: 1,
  })
  const db = drizzle(queryClient)

  console.warn('Migrating database...')
  await migrate(db, { migrationsFolder: migrationDir })
  console.warn('Migrating database... done')

  await queryClient.end()
}

rundevMigration()
