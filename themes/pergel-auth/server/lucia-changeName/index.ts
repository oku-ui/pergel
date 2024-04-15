import { GitHub, Google } from 'arctic'
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
    options: {
      getUserAttributes(databaseUserAttributes) {
        const { password, provider, providerId, ...attributes } = databaseUserAttributes
        return attributes
      },
    },
    session,
    user,
  })

export type ChangeNameAuth = typeof changeNameAuth

export const changeNameLuciaRequest = pergelChangeName().lucia().onRequestLucia({
  lucia: changeNameAuth,
})

const config = useRuntimeConfig()

export const github = new GitHub(
  config.changeNameLucia.github.clientId,
  config.changeNameLucia.github.clientSecret,
)

export const google = new Google(
  config.changeNameLucia.google.clientId,
  config.changeNameLucia.google.clientSecret,
  config.changeNameLucia.google.redirectURI,
)
