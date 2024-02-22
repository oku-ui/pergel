export default eventHandler(async (event) => {
  const db = await pergelTest().drizzle().postgresjs().connect({
    event,
  })
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
    .from(testTables.user).where(eq(testTables.user.username, username)).execute()

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

  const session = await testAuth.createSession(existingUser.id, {})
  appendHeader(event, 'Set-Cookie', testAuth.createSessionCookie(session.id).serialize())
})
