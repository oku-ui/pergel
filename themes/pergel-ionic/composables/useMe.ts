// composables/useIonicSettings.js

import { ref } from 'vue'
import type { User } from '#types'

export function useMe() {
  const user = ref<User>()
  const setUser = (newUser: User) => {
    user.value = newUser
    console.log('new user', user.value)
  }

  return {
    user,
    setUser,
  }
}
