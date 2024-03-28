import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'

export type DrizzleChangeNamePostgresJsDatabase = PostgresJsDatabase<typeof changeNameTables>

let _db: DrizzleChangeNamePostgresJsDatabase

export async function changeNameDbConnect() {
  if (_db)
    return _db

  const client = await pergelChangeName().drizzle()
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
    schema: changeNameTables,
  })
  return _db
}
