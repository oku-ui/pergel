import { auth } from './auth'
import type { API } from './types'
import { search } from './search'

export function changeNameDrizzleStorage({ db }: API) {
  return {
    auth: auth({ db }),
    search: search({ db }),
  }
}

export type ChangeNameDrizzleStorage = ReturnType<typeof changeNameDrizzleStorage>
