// composables/useIonicSettings.js

import { ref } from 'vue'
import type { LangType, ThemeType } from '#types'

export function useSettings() {
  const language = ref<LangType>('en')
  const pushNotifications = ref(false)
  const colorMode = useColorMode()
  const colors = ['system', 'light', 'dark']

  const isDark = computed({
    get() {
      return colorMode.value
    },
    set(data: string) {
      colors.includes(data) && (colorMode.preference = data as ThemeType)
    },
  })

  const setLanguage = (newLanguage: LangType) => {
    language.value = newLanguage
  }

  const setPushNotifications = (newPushNotifications: boolean) => {
    pushNotifications.value = newPushNotifications
  }

  const setThemeColor = (ev: any) => {
    isDark.value = ev.detail.value
  }

  return {
    language,
    pushNotifications,
    isDark,
    colors,
    setLanguage,
    setPushNotifications,
    setThemeColor,
  }
}
