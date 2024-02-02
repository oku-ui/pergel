import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const tableName = camelCase(`${data.projectName}-Tables`)
  return /* TS */ `import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { faker } from '@faker-js/faker'
import * as ${tableName} from '../schema/index'

export async function seed1(db: PostgresJsDatabase) {
  console.warn('Seeding database...')

  await db.transaction(async (trx) => {
    await trx.insert(${tableName}.user).values(
      [
        {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          username: faker.internet.userName(),
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
