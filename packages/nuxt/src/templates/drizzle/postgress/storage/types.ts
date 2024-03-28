export default function (
  data: {
    projectName: string
  },
) {
  const drizzleType = `Drizzle${data.projectName}PostgresJsDatabase`
  return /* TS */ `export interface API {
  db: ${drizzleType}
}
`
}
