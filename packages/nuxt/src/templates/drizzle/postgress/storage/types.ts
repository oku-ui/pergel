export default function (
  // data: {
  //   projectName: string
  // },
) {
  // const tables = camelCase(`${data.projectName}-Tables`)
  return /* TS */ `
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export interface API {
  db: PostgresJsDatabase
}
`
}
