import type { NuxtPergel } from '../../runtime/core/types/nuxtModule'
import { generatorFunctionName } from '../../runtime/core/utils/generatorNames'

export default function (data: {
  projectName: string
  nuxt: NuxtPergel
}) {
  const typeName = generatorFunctionName(data.projectName, 'Auth', {
    type: true,
  })
  return /* TS */ `import type { Session, User } from '#${data.projectName}/drizzle/schema'
import type { ${typeName} } from '#${data.projectName}/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof ${typeName}
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
