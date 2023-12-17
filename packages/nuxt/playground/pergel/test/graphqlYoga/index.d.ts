declare module '#pergel/types' {

  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { H3Event } from 'h3'
  import type { YogaInitialContext } from 'graphql-yoga'

  interface TestContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
  }

}
