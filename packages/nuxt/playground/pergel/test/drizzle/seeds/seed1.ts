import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

// import { faker } from '@faker-js/faker'
import consola from 'consola'
import * as tablestest from '../schema/index'

export async function seed1(db: PostgresJsDatabase) {
  consola.info('Seeding database...')

  await db.transaction(async (trx) => {
    await trx.insert(tablestest.user).values(
      [
        {
          email: 'test',
          name: 'a',
          password: 'a',
        },
      ],
    ).catch((res) => {
      consola.info('Seeding database... catch', res)
    })
  }).catch((err: string) => {
    consola.log('a', err)
  })

  consola.info('Seeding database... done')
}
