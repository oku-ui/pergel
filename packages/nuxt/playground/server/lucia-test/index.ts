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
