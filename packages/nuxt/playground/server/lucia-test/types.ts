import type { Session, User } from '#test/server/drizzle/schema'
import type { TestTestAuth } from '#test/server/lucia'

declare module 'lucia' {
  interface Register {
    Lucia: TestTestAuth
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
