// import { PostgresError } from 'postgres'
import { auth } from '#test/lucia'

export default eventHandler(async (event) => {
  const db = await pergelTest().drizzle().postgresjs().connect({})

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

  const hashedPassword = await new Argon2id().hash(password)

  try {
    const [_user] = await db.insert(tablesTest.user).values({
      username,
      email: body.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    const session = await auth.createSession(_user.id, {})
    appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())
  }
  catch (e) {
    // /postgres/src/index.js' does not provide an export named 'PostgresError'
    throw createError({
      message: 'Username already used',
      statusCode: 500,
    })

    // if (e instanceof PostgresError && e.code === '23505') {
    //   throw createError({
    //     message: 'Username already used',
    //     statusCode: 500,
    //   })
    // }
    // throw createError({
    //   message: 'An unknown error occurred',
    //   statusCode: 500,
    // })
  }
})
