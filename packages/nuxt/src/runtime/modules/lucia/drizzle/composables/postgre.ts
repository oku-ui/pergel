import { Lucia } from 'lucia'
import { defu } from 'defu'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import type { PgDatabase } from 'drizzle-orm/pg-core'

import type { LuciaOptions } from '../../types'

export function useLuciaDrizzlePostgre(
  data: {
    db: PgDatabase<any, any>
    options: LuciaOptions
    session: ConstructorParameters<typeof DrizzlePostgreSQLAdapter>['1']
    user: ConstructorParameters<typeof DrizzlePostgreSQLAdapter>['2']
  },
) {
  const { db, options, session, user } = data

  const adapter = new DrizzlePostgreSQLAdapter(db, session, user)

  const lucia = new Lucia(adapter, defu(options ?? {}, {
    sessionCookie: {
      // IMPORTANT!
      attributes: {
        // set to `true` when using HTTPS
        secure: !process.dev,
      },
    },
  } as LuciaOptions))
  return lucia
}
