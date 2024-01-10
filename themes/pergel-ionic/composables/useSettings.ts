// composables/useIonicSettings.js

import { ref } from 'vue'
import type { LangType } from '#types'

export function useSettings() {
  const language = ref<LangType>('en')
  const pushNotifications = ref(false)
  const themeColor = ref<ThemeType>('default')

  const setLanguage = (newLanguage: LangType) => {
    language.value = newLanguage
  }

  const setPushNotifications = (newPushNotifications: boolean) => {
    pushNotifications.value = newPushNotifications
  }

  const setThemeColor = (newThemeColor: ThemeType) => {
    themeColor.value = newThemeColor
  }

  return {
    language,
    pushNotifications,
    themeColor,
    setLanguage,
    setPushNotifications,
    setThemeColor,
  }
}
