<script setup lang="ts">
import { computed } from 'vue'
import type { LangType, LocaleObject } from '#types'

const { themeColor, setThemeColor, setLanguage } = useSettings()
const { locale, locales, t, setLocale } = useI18n()

const themeToggled = computed(() => themeColor.value === 'dark')
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
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="justify-center text-center">
          {{ t("settings.appearance.title") }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" color="light">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="justify-center text-center">
            {{ t("settings.appearance.title") }}
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list :inset="true" lines="inset">
        <ion-item>
          <div slot="start" aria-hidden="true" :class="themeColor === 'default' ? 'i-ph-moon-fill' : 'i-ph-sun-dim-fill'" class=" mr-3"></div>
          <ion-toggle :checked="themeToggled" @ion-change="toggleDarkMode">
            {{ t("settings.appearance.dark_mode") }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <div slot="start" aria-hidden="true" class="i-ph-translate mr-3"></div>
          <ion-select :label="t('settings.appearance.language')" :placeholder="locale" @ion-change="handleLangChange">
            <ion-select-option v-for="lang in availableLocales" :key="lang.code" :value="lang.code">
              {{
                lang.name
              }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
