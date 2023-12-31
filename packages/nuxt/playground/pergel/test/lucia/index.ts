import { session, user } from 'test/drizzle/schema'

const connect = await pergelTest().drizzle().postgresjs().connect({})

export const auth = pergelTest().lucia().use({
  db: connect,
  options: {
  },
  session,
  user,
})
