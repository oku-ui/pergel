import { camelCase } from 'scule'
import type { NuxtPergel } from '../../../../../core/types/nuxtModule'

export default function (data: {
  nuxt: NuxtPergel
  projectName: string
}) {
  const drizzleDriver = data.nuxt._pergel.projects[data.projectName].drizzle?.driver

  const drizzleStorageName = data.projectName.slice(0, 1).toUpperCase() + camelCase(`${data.projectName}-DrizzleStorage`).slice(1)
  return /* TS */ `
declare module 'pergel/${data.projectName}/types' {

  import type { ${drizzleStorageName} } from '#${data.projectName}/server/drizzle/storage'
  import type { H3Event } from 'h3'
  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { YogaInitialContext } from 'graphql-yoga'
  ${drizzleDriver === 'postgresjs:pg' ? 'import type { PostgresJsDatabase } from \'drizzle-orm/postgres-js\'' : ''}

  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
    ${drizzleDriver === 'postgresjs:pg' ? 'db: PostgresJsDatabase' : ''.trim()}
    storage: ${drizzleStorageName}
  }
}
`
}
