import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const tables = camelCase(`${data.projectName}-Tables`)
  return /* TS */ `
import consola from 'consola'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'auth',
})

async function create(this: API, params: {
  username: string
  email: string
  hashedPassword: string
}) {
  const [_user] = await this.db
    .insert(${tables}.user)
    .values({
      username: params.username,
      email: params.email,
      password: params.hashedPassword,
    }).returning()

  return _user
}

async function login(this: API, params: {
  username: string
  password: string
}) {
  const [existingUser] = await this.db
    .select()
    .from(${tables}.user)
    .where(eq(${tables}.user.username, params.username))
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
    .from(${tables}.user)
    .where(eq(${tables}.user.username, params.username))
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
    .from(${tables}.user)
    .execute()

  if (!users) {
    logger.error(':login - Invalid credentials')
    throw new Error('Invalid credentials')
  }

  return users
}

export function auth({ db }: API) {
  return {
    create: create.bind({ db }),
    login: login.bind({ db }),
    logout: logout.bind({ db }),
    logger,
    users: users.bind({ db }),
  }
}
`
}
