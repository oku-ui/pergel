import { auth } from './auth'
import { email } from './email'
import type { API } from './types'

export function changeNameGraphQLService({ context }: API) {
  return {
    auth: auth({ context }),
    email: email({ context }),
  }
}

export type ChangeNameGraphQLService = ReturnType<typeof changeNameGraphQLService>
