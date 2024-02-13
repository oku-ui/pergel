import { auth } from './auth'
import type { API } from './types'
import { search } from './search'

export function rocketDrizzleStorage({ db }: API) {
  return {
    auth: auth({ db }),
    search: search({ db }),
  }
}

export type RocketDrizzleStorage = ReturnType<typeof rocketDrizzleStorage>
