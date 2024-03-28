import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const pergelFunctionName = camelCase(`pergel-${data.projectName}`)
  const tablesFunctionName = camelCase(`${data.projectName}-tables`)
  const drizzleType = camelCase(`Drizzle-${data.projectName}-PostgresJsDatabase`)

  const functionName = camelCase(`${data.projectName}-db-connect`)

  return /* TS */ `import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
export type ${drizzleType} = PostgresJsDatabase<typeof ${tablesFunctionName}>

let _db: ${drizzleType}

export async function ${functionName}() {
  if (_db)
    return _db

  const client = await ${pergelFunctionName}().drizzle()
    .postgresjs()
    .connect({
      pgOptions: {
        options: {
          connection: {
            TimeZone: 'UTC',
          },
        },
      },
    })

  _db = drizzle(client, {
    schema: ${tablesFunctionName},
  })
  return _db
}
`
}
