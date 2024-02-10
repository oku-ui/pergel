import type { NuxtPergel } from '../../../../runtime/core/types/nuxtModule'

export default function (data: {
  nuxt: NuxtPergel
  projectName: string
}) {
  return /* TS */ `
declare module 'pergel/${data.projectName}/types' {

  import type { H3Event } from 'h3'
  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { YogaInitialContext } from 'graphql-yoga'


  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
  }
}
`
}
