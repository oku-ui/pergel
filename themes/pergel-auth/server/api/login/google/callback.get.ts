import type { GoogleUser } from '@lucia-auth/oauth/providers'
import { OAuth2RequestError } from 'arctic'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const storedCodeVerifier = getCookie(event, 'google_oauth_code_verifier') ?? null
  const returnToPage = '/home'

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  const db = await pergelChangeName().drizzle().postgresjs().connect({
    event,
  })

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
    const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const authUser: GoogleUser = await response.json()

    const { auth } = changeNameDrizzleStorage({ db })

    const existingUser = await auth.existingUserProvider({
      provider: 'google',
      providerId: String(authUser.sub),
    })

    if (existingUser) {
      const session = await changeNameAuth.createSession(existingUser.id, {})
      await db.update(changeNameTables.user)
        .set({
          loggedInAt: new Date(),
        })
        .where(
          eq(changeNameTables.user.id, existingUser.id),
        )
      appendHeader(event, 'Set-Cookie', changeNameAuth.createSessionCookie(session.id).serialize())
      return sendRedirect(event, returnToPage)
    }

    if (!authUser.email && tokens.accessToken) {
      throw createError({
        statusCode: 400,
        message: 'Google login failed: no user email found',
      })
    }

    if (!authUser.email || !authUser.sub || !authUser.email) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          message: 'Google login failed: no user email found',
        }),
      )
    }

    const hashedPassword = await new Argon2id().hash(uuidV4())

    const user = await auth.create({
      email: authUser.email,
      hashedPassword,
      username: authUser.name,
      loggedInAt: new Date(),
      provider: 'google',
      providerId: String(authUser.sub),
      picture: authUser.picture,
    })

    const session = await changeNameAuth.createSession(user.id, {})
    appendHeader(event, 'Set-Cookie', changeNameAuth.createSessionCookie(session.id).serialize())
    return sendRedirect(event, returnToPage)
  }
  catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      throw createError({
        status: 400,
      })
    }
    console.error(e)
    throw createError({
      status: 500,
    })
  }
})
