import type { Session, User } from '#changeName/server/drizzle/schema'
import type { changeNameAuth } from '#changeName/server/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof changeNameAuth
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
