import { auth } from './auth'
import { email } from './email'
import type { API } from './types'

export function rocketGraphQLService({ context }: API) {
  return {
    auth: auth({ context }),
    email: email({ context }),
  }
}

export type RocketGraphQLService = ReturnType<typeof rocketGraphQLService>
