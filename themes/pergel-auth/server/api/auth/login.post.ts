import { Argon2id } from 'oslo/password'
import { auth } from '#pergel/changeName/lucia'

export default eventHandler(async (event) => {
  const db = await pergelChangeName().drizzle().postgresjs().connect({})
  const body = await readBody(event)
  const username = body.username
  if (
    typeof username !== 'string'
      || username.length < 3
      || username.length > 31
      || !/^[a-z0-9_-]+$/.test(username)
  ) {
    throw createError({
      message: 'Invalid username',
      statusCode: 400,
    })
  }
  const password = body.password
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    })
  }

  const [existingUser] = await db.select()
    .from(tablesChangeName.user).where(eq(tablesChangeName.user.username, username)).execute()

  if (!existingUser) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    })
  }

  const validPassword = await new Argon2id().verify(existingUser.password, password)
  if (!validPassword) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    })
  }

  const session = await auth.createSession(existingUser.id, {})
  appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())
})
