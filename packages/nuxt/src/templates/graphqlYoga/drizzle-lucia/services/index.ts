import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const serviceName = camelCase(`${data.projectName}-GraphQLService`)
  const firstLetter = serviceName[0].toUpperCase() + serviceName.slice(1)
  return /* TS */ `import { auth } from './auth'
import { email } from './email'
import type { API } from './types'

export function ${serviceName}({ context }: API) {
  return {
    auth: auth({ context }),
    email: email({ context }),
  }
}

export type ${firstLetter} = ReturnType<typeof ${serviceName}>
`
}
