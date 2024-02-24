import consola from 'consola'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'auth',
})

async function create(this: API, params: {
  username: string
  email: string
  password: string
}) {
  const hashedPassword = await new Argon2id()
    .hash(params.password)

  const user = await this.context.storage.auth.create({
    email: params.email,
    hashedPassword,
    username: params.username,
  })

  if (!user)
    throw new GraphQLError('User not found')

  const session = await rocketAuth.createSession(user.id, {})

  appendHeader(this.context.event, 'Set-Cookie', rocketAuth.createSessionCookie(session.id).serialize())
  return {
    user,
    session,
  }
}

export function auth(input: API) {
  return {
    create: create.bind(input),
    logger,
  }
}
