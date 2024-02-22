import type { NuxtPergel } from '../../runtime/core/types/nuxtModule'
import { generatorFunctionName } from '../../runtime/core/utils/generatorNames'

export default function (params: {
  projectName: string
  nuxt: NuxtPergel
}) {
  const typeName = generatorFunctionName(params.projectName, 'TestAuth', {
    type: true,
  })
  return /* TS */ `import type { Session, User } from '#${params.projectName}/server/drizzle/schema'
import type { ${typeName} } from '#${params.projectName}/server/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: ${typeName}
    DatabaseUserAttributes: DatabaseUserAttributes
    DatabaseSessionAttributes: DatabaseSessionAttributes
  }
  interface DatabaseUserAttributes extends Omit<User, 'id'> {}

  interface DatabaseSessionAttributes {
  }
}

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
`
}
