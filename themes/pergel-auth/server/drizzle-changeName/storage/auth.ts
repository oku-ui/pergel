import consola from 'consola'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'auth',
})

async function create(this: API, params: {
  username: string
  email: string
  hashedPassword: string
  loggedInAt: Date
  provider?: string
  providerId?: string
  picture?: string
}) {
  const [_user] = await this.db
    .insert(changeNameTables.user)
    .values({
      username: params.username,
      email: params.email,
      password: params.hashedPassword,
      loggedInAt: params.loggedInAt,
      provider: params.provider,
      providerId: params.providerId,
      picture: params.picture,
    }).returning()

  return _user
}

async function login(this: API, params: {
  username: string
  password: string
}) {
  const [existingUser] = await this.db
    .select()
    .from(changeNameTables.user)
    .where(eq(changeNameTables.user.username, params.username))
    .execute()

  if (!existingUser) {
    logger.error(':login - Invalid credentials')
    throw new Error('Invalid credentials')
  }

  return existingUser
}

async function logout(this: API, params: {
  username: string
}) {
  const [existingUser] = await this.db
    .select()
    .from(changeNameTables.user)
    .where(eq(changeNameTables.user.username, params.username))
    .execute()

  if (!existingUser) {
    logger.error(':login - Invalid credentials')
    throw new Error('Invalid credentials')
  }

  return existingUser
}

async function users(this: API) {
  const users = await this.db
    .select()
    .from(changeNameTables.user)
    .execute()

  if (!users) {
    logger.error(':login - Invalid credentials')
    throw new Error('Invalid credentials')
  }

  return users
}

async function existingUserProvider(this: API, params: {
  provider: 'github' | 'google'
  providerId: string
}) {
  const [existingUser] = await this.db
    .select()
    .from(changeNameTables.user)
    .where(
      and(
        eq(changeNameTables.user.provider, params.provider),
        eq(changeNameTables.user.providerId, params.providerId),
      ),
    )
    .execute()

  return existingUser
}

export function auth({ db }: API) {
  return {
    logger,
    create: create.bind({ db }),
    login: login.bind({ db }),
    logout: logout.bind({ db }),
    users: users.bind({ db }),
    existingUserProvider: existingUserProvider.bind({ db }),
  }
}
