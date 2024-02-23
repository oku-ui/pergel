import { auth } from './auth'
import { email } from './email'
import type { API } from './types'

export function changeNameGraphQLService({ context }: API) {
  return {
    auth: auth({ context }),
    email: email({ context }),
  }
}

export function checkSession(params: API) {
  const session = params.context.event.context.session
  const user = params.context.event.context.user

  if (!session || !user) {
    throw new GraphQLError('Session ignore', {
      extensions: {
        http: {
          status: 403,
        },
      },
    })
  }
  return {
    user,
    session,
  }
}

export type ChangeNameGraphQLService = ReturnType<typeof changeNameGraphQLService>
