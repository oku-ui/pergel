export default eventHandler(async (event) => {
  const db = changeNameDbConnect()

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
    .from(changeNameTables.user).where(eq(changeNameTables.user.username, username)).execute()

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

  const session = await changeNameAuth.createSession(existingUser.id, {})
  appendHeader(event, 'Set-Cookie', changeNameAuth.createSessionCookie(session.id).serialize())
})
