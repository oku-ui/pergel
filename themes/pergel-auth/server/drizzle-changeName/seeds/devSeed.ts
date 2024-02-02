import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { seed1 } from './seed1'

config()

const dbUrl = process.env.NUXT_CHANGE_NAME_DRIZZLE_URL

async function rundevSeed() {
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

  console.warn('Seeding database...')
  await seed1(db)

  console.warn('Seeding database... done')

  await queryClient.end()
}

rundevSeed()
