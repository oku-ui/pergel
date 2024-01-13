import type { Session, User } from '#pergel/test/drizzle/schema'
import type { auth } from '#pergel/test/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth
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
