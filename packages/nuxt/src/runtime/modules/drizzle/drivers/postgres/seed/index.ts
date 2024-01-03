export default function (data: {
  env: {
    dbUrl: string
    dbDrop: string
    dbSeed: string
    dbDev: string
    dbMigrate: string
  }
  migrationDir: string
}) {
  return `// The seed file is also automatically run 1 time when you make pnpm/npm/yarn dev. You need to think about this process accordingly. It depends on env ${data.env.dbDev}.

import { resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { seed1 } from './seed1'
import { execSync } from 'node:child_process'
import consola from 'consola'

const logger = consola.create({
  defaults: {
    tag: 'drizzle:seed',
  }
})

config()

const dbUrl = process.env.${data.env.dbUrl}
const dbDrop = process.env.${data.env.dbDrop} === 'true'
const dbSeed = process.env.${data.env.dbSeed} === 'true'
const dbDev = process.env.${data.env.dbDev} === 'true'
const dbMigrate = process.env.${data.env.dbMigrate} === 'true'

const migrationDir = resolve('${data.migrationDir}')

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
    logger.info('Dropping database...')
    await db.execute(sql/* SQL */ \`
DROP SCHEMA IF EXISTS drizzle CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
CREATE SCHEMA drizzle;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "public";
\`)
    logger.success('Dropping database... done')
  }

  if (dbMigrate) {
    logger.info('Migrating database...')
    await migrate(db, { migrationsFolder: migrationDir })
    logger.success('Migrating database... done')
  }

  if (dbDev) {
    logger.info('Pushing database...')
    execSync(\`pergel module -s=push -p=test -m=drizzle\`, {
      stdio: 'inherit',
    })
    logger.success('Pushing database... done')
  }

  if (dbSeed) {
    logger.info('Seeding database...')
    await seed1(db)
    logger.success('Seeding database... done')
  }

  await queryClient.end()
}

runMigrationsAndSeed()
  `
}
