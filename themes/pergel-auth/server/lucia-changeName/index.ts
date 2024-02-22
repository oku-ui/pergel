import { GitHub } from 'arctic'

import { session, user } from '#changeName/server/drizzle/schema'

const connect = await pergelChangeName()
  .drizzle()
  .postgresjs()
  .connect({
    event: false,
  })

export const changeNameAuth = pergelChangeName()
  .lucia()
  .use({
    db: connect,
    options: { },
    session,
    user,
  })

const config = useRuntimeConfig()

export const github = new GitHub(
  config.changeNameLucia.github.clientId,
  config.changeNameLucia.github.clientSecret,
)

export const changeNameLuciaRequest = pergelChangeName().lucia().onRequestLucia({
  lucia: changeNameAuth,
})
