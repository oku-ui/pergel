declare module '#changeName/graphqlYoga/types' {

  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { H3Event } from 'h3'
  import type { YogaInitialContext } from 'graphql-yoga'
  import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
  import type { ChangeNameDrizzleStorage } from '#changeName/drizzle/storage'

  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
    db: PostgresJsDatabase
    storage: ChangeNameDrizzleStorage
  }
}
