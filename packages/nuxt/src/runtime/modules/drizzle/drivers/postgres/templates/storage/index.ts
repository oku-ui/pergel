import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const funtionName = camelCase(`${data.projectName}-Drizzle-Storage`)
  const firstLetter = funtionName[0].toUpperCase() + funtionName.slice(1)
  return /* TS */ `
import { auth } from './auth'
import type { API } from './types'
import { search } from './search'

export function ${funtionName}({ db }: API) {
  return {
    auth: auth({ db }),
    search: search({ db }),
  }
}

export type ${firstLetter} = ReturnType<typeof ${funtionName}>
`
}
