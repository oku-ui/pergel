import { GitHub } from 'arctic'
import { session, user } from '#test/server/drizzle/schema'

const connect = await pergelTest()
  .drizzle()
  .postgresjs()
  .connect({
    event: false,
  })

export const testAuth = pergelTest()
  .lucia()
  .use({
    db: connect,
    options: { },
    session,
    user,
  })

export type TestTestAuth = typeof testAuth

export const testLuciaOnRequest = pergelTest().lucia().onRequestLucia({
  lucia: testAuth,
})

const config = useRuntimeConfig()

// nuxt.config.ts lucia.oauth = ['github'] if you want to use github oauth ['github', 'google', ....]
export const github = new GitHub(
  config.testLucia.github.clientId,
  config.testLucia.github.clientSecret,
)
