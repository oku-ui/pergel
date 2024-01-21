declare module 'pergel/test/types' {

  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { H3Event } from 'h3'
  import type { YogaInitialContext } from 'graphql-yoga'

  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
  }

}
