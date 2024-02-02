import { auth } from './auth'
import type { API } from './types'
import { search } from './search'

export function changeNameStorage({ db }: API) {
  return {
    auth: auth({ db }),
    search: search({ db }),
  }
}

export type ChangeNameStorage = ReturnType<typeof changeNameStorage>
