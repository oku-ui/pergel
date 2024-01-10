<script setup lang="ts">
import type { LangType, LocaleObject } from '#types'

const { themeColor, setThemeColor, setLanguage } = useSettings()
const { locale, locales, t, setLocale } = useI18n()

// const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return (locales.value as LocaleObject[])
})

function toggleDarkMode() {
  document.body.classList.toggle('dark')

  if (themeColor.value === 'default')
    setThemeColor('dark')
  else
    setThemeColor('default')

  console.log('toggled:theme', themeColor.value)
}
function handleLangChange(ev: any) {
  console.log('Current value:', JSON.stringify(ev.detail.value))

  // switchLocalePath(JSON.stringify(ev.detail.value))
  setLocale(JSON.stringify(ev.detail.value))
  setLanguage(JSON.stringify(ev.detail.value) as LangType)
}
</script>

<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title> {{ t("settings.title") }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true" color="light">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">
          {{ t("settings.title") }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list :inset="true" lines="full">
      <ion-item>
        <!-- <div class="i-ph-moon-light h-10 w-10 text-white"></div> -->
        <ion-toggle @ion-change="toggleDarkMode">
          {{ t("settings.general.dark_mode") }}
        </ion-toggle>
      </ion-item>
      <ion-item>
        <ion-select label="Language" :placeholder="locale" @ion-change="handleLangChange">
          <ion-select-option v-for="lang in availableLocales" :key="lang.code" :value="lang.code">
            {{
              lang.name
            }}
          </ion-select-option>
        </ion-select>
      </ion-item>
    </ion-list>
  </ion-content>
</template>
