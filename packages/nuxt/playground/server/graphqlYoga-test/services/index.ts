import { auth } from './auth'
import { email } from './email'
import type { API } from './types'

export function testGraphQLService({ context }: API) {
  return {
    auth: auth({ context }),
    email: email({ context }),
  }
}

export type TestGraphQLService = ReturnType<typeof testGraphQLService>
