import { session, user } from '#changeName/drizzle/schema'

const connect = await pergelChangeName().drizzle().postgresjs().connect({})

export const auth = pergelChangeName().lucia().use({
  db: connect,
  options: { },
  session,
  user,
})
