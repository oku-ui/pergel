export default function () {
  return /* TS */ `import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { faker } from '@faker-js/faker'
import * as tablesTest from '../schema/index'

export async function seed1(db: PostgresJsDatabase) {
  console.warn('Seeding database...')

  await db.transaction(async (trx) => {
    await trx.insert(tablesTest.user).values(
      [
        {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        },
      ],
    ).catch((res) => {
      console.warn('Seeding database... catch', res)
    })
  }).catch((_err: any) => {
  })

  console.warn('Seeding database... done')
}
`
}
