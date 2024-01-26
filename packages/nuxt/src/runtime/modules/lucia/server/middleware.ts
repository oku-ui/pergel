import { verifyRequestOrigin } from 'lucia'
import { appendResponseHeader, defineEventHandler, getCookie, getHeader, getHeaders, isMethod } from 'h3'

import type { Lucia } from 'lucia'

export function definePergelNitroMiddleware(data: {
  lucia: Lucia
}) {
  const { lucia } = data
  return defineEventHandler(async (event) => {
    const authorizationHeader = getHeaders(event).Authorization

    if (authorizationHeader) {
      const sessionId = lucia.readBearerToken(authorizationHeader)

      if (!sessionId)
        return event.node.res.writeHead(403).end()

      const { session, user } = await lucia.validateSession(sessionId)
      event.context.session = session
      event.context.user = user
      return
    }

    if (!isMethod(event, 'GET')) {
      const originHeader = getHeader(event, 'Origin') ?? null
      const hostHeader = getHeader(event, 'Host') ?? null
      if (
        !originHeader
        || !hostHeader
        || !verifyRequestOrigin(originHeader, [hostHeader]))
        return event.node.res.writeHead(403).end()
    }

    const sessionId = getCookie(event, lucia.sessionCookieName) ?? null

    if (!sessionId) {
      event.context.session = null
      event.context.user = null
      return
    }

    const { session, user } = await lucia.validateSession(sessionId)

    if (session && session.fresh) {
      appendResponseHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
    }

    if (!session) {
      appendResponseHeader(
        event,
        'Set-Cookie',
        lucia.createBlankSessionCookie().serialize(),
      )
    }

    event.context.session = session
    event.context.user = user
  })
}
