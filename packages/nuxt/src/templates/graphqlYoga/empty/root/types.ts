import type { NuxtPergel } from '../../../../runtime/core/types/nuxtModule'
import { generatorFunctionName } from '../../../../runtime/core/utils/generatorNames'

export default function (data: {
  nuxt: NuxtPergel
  projectName: string
}) {
  const drizzleDriver = data.nuxt._pergel.projects[data.projectName].drizzle?.driver

  const typeDrizzleStorageName = generatorFunctionName(data.projectName, 'DrizzleStorage', {
    type: true,
  })
  return /* TS */ `
declare module '#${data.projectName}/server/graphqlYoga/types' {

  import type { H3Event } from 'h3'
  import type { IncomingMessage, ServerResponse } from 'node:http'
  import type { YogaInitialContext } from 'graphql-yoga'
  import type { ${typeDrizzleStorageName} } from '#${data.projectName}/server/drizzle/storage'
  ${drizzleDriver === 'postgresjs:pg' ? 'import type { PostgresJsDatabase } from \'drizzle-orm/postgres-js\'' : ''}

  interface GraphqlYogaContext extends YogaInitialContext {
    res: ServerResponse
    req: IncomingMessage
    event: H3Event
    ${drizzleDriver === 'postgresjs:pg' ? 'db: PostgresJsDatabase' : ''.trim()}
    storage: ${typeDrizzleStorageName}
  }
}
`
}
