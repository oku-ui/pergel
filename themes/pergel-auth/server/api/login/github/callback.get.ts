import { ofetch } from 'ofetch'
import type { GithubUser } from '@lucia-auth/oauth/providers'
import { OAuth2RequestError } from 'arctic'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null

  const returnToPage = '/'

  if (!code || !state || !storedState || (state !== storedState)) {
    throw createError({
      status: 400,
    })
  }

  const { githubClientId } = useRuntimeConfig()
  const db = await pergelChangeName().drizzle().postgresjs().connect({
    event,
  })

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const authUser: GithubUser = await response.json()

    const { auth } = changeNameDrizzleStorage({ db })

    const existingUser = await auth.existingUserProvider({
      provider: 'github',
      providerId: String(authUser.id),
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
      const emails: any[] = await ofetch('https://api.github.com/user/emails', {
        headers: {
          'User-Agent': `Github-OAuth-${githubClientId}`,
          'Authorization': `token ${tokens.accessToken}`,
        },
      })

      const primaryEmail = emails.find((email: any) => email.primary)
      // Still no email
      if (!primaryEmail)
        throw new Error('GitHub login failed: no user email found')

      authUser.email = primaryEmail.email
    }
    else {
      throw createError({
        statusCode: 400,
        message: 'GitHub login failed: no user email found',
      })
    }

    if (!authUser.email || !authUser.id || !authUser.email) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          message: 'GitHub login failed: no user email found',
        }),
      )
    }

    const hashedPassword = await new Argon2id().hash(uuidV4())

    const user = await auth.create({
      email: authUser.email,
      hashedPassword,
      username: authUser.login,
      loggedInAt: new Date(),
      provider: 'github',
      providerId: String(authUser.id),
      picture: authUser.avatar_url,
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
