import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

config()

const dbUrl = process.env.NUXT_CHANGE_NAME_DRIZZLE_URL

async function rundevDrop() {
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

  console.warn('Dropping database...')

  await db.execute(sql/* SQL */`
DROP SCHEMA IF EXISTS drizzle CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
CREATE SCHEMA drizzle;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "public";
`)

  console.warn('Dropping database... done')

  await queryClient.end()
}

rundevDrop()
