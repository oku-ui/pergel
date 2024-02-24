import type { Session, User } from '#changeName/server/drizzle/schema'
import type { ChangeNameAuth } from '#changeName/server/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: ChangeNameAuth
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

export type AuthUser = User
