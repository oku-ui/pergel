import { resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { seed1 } from './seed1'

config()

const dbUrl = process.env.NUXT_CHANGE_NAME_DRIZZLE_URL
const dbDrop = process.env.NUXT_CHANGE_NAME_DRIZZLE_DROP === 'true'
const dbSeed = process.env.NUXT_CHANGE_NAME_DRIZZLE_SEED === 'true'
const dbMigrate = process.env.NUXT_CHANGE_NAME_DRIZZLE_MIGRATE === 'true'

const migrationDir = resolve('/Users/productdevbook/works/pergel/themes/pergel-auth/server/drizzle-changeName/migrations')

async function runMigrationsAndSeed() {
  if (!dbUrl)
    throw new Error('NUXT_PG_DB_URL must be set')

  const queryClient = postgres(dbUrl, {
    onnotice: () => { },
    connection: {
      TimeZone: 'UTC',
    },
    max: 1,
  })
  const db = drizzle(queryClient)

  if (dbDrop) {
    console.warn('Dropping database...')
    await db.execute(sql/* SQL */`
DROP SCHEMA IF EXISTS drizzle CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
CREATE SCHEMA drizzle;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "public";
`)
  }

  if (dbMigrate) {
    console.warn('Migrating database...')
    await migrate(db, { migrationsFolder: migrationDir })
    console.warn('Migrating database... done')
  }

  if (dbSeed) {
    console.warn('Seeding database...')
    await seed1(db)
  }

  await queryClient.end()
}

runMigrationsAndSeed()
