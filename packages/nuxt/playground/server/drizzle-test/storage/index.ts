import { auth } from './auth'
import type { API } from './types'
import { search } from './search'

export function testDrizzleStorage({ db }: API) {
  return {
    auth: auth({ db }),
    search: search({ db }),
  }
}

export type TestDrizzleStorage = ReturnType<typeof testDrizzleStorage>
