export default function (data: {
  env: {
    dbUrl: string
  }
  migrationDir: string
}) {
  return `import { resolve } from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'

config()

const dbUrl = process.env.${data.env.dbUrl}

const migrationDir = resolve('${data.migrationDir}')

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
  `
}
