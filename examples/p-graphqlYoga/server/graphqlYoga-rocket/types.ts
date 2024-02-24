declare module '#rocket/server/graphqlYoga/types' {

  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { H3Event } from 'h3'
  import type { YogaInitialContext } from 'graphql-yoga'
  import type { RocketDrizzleStorage } from '#rocket/server/drizzle/storage'

  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event

    storage: RocketDrizzleStorage
  }
}
