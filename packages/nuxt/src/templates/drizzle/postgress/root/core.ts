import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const pergelFunctionName = camelCase(`pergel-${data.projectName}`)

  const functionName = camelCase(`${data.projectName}-db-connect`)

  return /* TS */ `export function ${functionName}() {
  return ${pergelFunctionName}().drizzle()
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
}
`
}
