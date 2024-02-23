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
    loggedInAt: new Date(),
    provider: 'password',
  })

  if (!user)
    throw new GraphQLError('User not found')

  const session = await changeNameAuth.createSession(user.id, {})

  appendHeader(
    this.context.event,
    'Set-Cookie',
    changeNameAuth.createSessionCookie(session.id).serialize(),
  )

  return {
    user,
    session,
  }
}

async function login(this: API, params: {
  usernameOrEmail: string
  password: string
}) {
  const isEmail = params.usernameOrEmail?.includes('@')

  const [existingUser] = await this.context.db
    .select()
    .from(changeNameTables.user)
    .where(
      isEmail
        ? eq(changeNameTables.user.email, params.usernameOrEmail)
        : eq(changeNameTables.user.username, params.usernameOrEmail),
    )

  if (!existingUser) {
    throw new GraphQLError('Incorrect username or password', {
      extensions: {
        http: {
          status: 400,
        },
      },
    })
  }

  const validPassword = await new Argon2id()
    .verify(existingUser.password, params.password)

  if (!validPassword) {
    throw new GraphQLError('Incorrect username or password', {
      extensions: {
        http: {
          status: 400,
        },
      },
    })
  }

  const session = await changeNameAuth.createSession(existingUser.id, {})
  appendHeader(
    this.context.event,
    'Set-Cookie',
    changeNameAuth.createSessionCookie(session.id).serialize(),
  )

  return {
    user: existingUser,
    session,
  }
}

async function logout(this: API) {
  const { user } = checkSession(this)

  await changeNameAuth.invalidateSession(user.id)
  appendHeader(
    this.context.event,
    'Set-Cookie',
    changeNameAuth.createBlankSessionCookie().serialize(),
  )

  return true
}

export function auth(input: API) {
  return {
    create: create.bind(input),
    login: login.bind(input),
    logout: logout.bind(input),
    logger,
  }
}
