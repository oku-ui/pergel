import type { Session, User } from '#changeName/drizzle/schema'
import type { changeNameAuth } from '#changeName/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof changeNameAuth
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
