<script setup lang="ts">
import { computed } from 'vue'
import type { InputCustomEvent } from '@ionic/vue'

const { isDark, colors, setThemeColor } = useSettings()
const { locale, locales, t, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value).filter((i: any) => i.code !== locale.value)
})

function handleLangChange(ev: InputCustomEvent) {
  localStorage.setItem('locale', ev.detail.value as string)
  locale.value = ev.detail.value as string
  document.documentElement.lang = ev.detail.value as string
  setLocale(ev.detail.value as string)
  window.location.reload()
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <NuxtLink to="/">
            Setting
          </NuxtLink>
        </ion-buttons>
        <ion-title class="justify-center text-center">
          {{ t("settings.appearance.title") }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list :inset="true" lines="inset">
        <ion-item>
          <div slot="start" aria-hidden="true" class="mr-3">
            <AtomIcon :name="isDark ? 'i-ph-moon' : 'i-ph-sun'" class="h-4 w-4" />
          </div>
          <ion-select
            :label="t('settings.appearance.dark_mode')"
            :placeholder="isDark"
            @ion-change="setThemeColor"
          >
            <ion-select-option
              v-for="color in colors"
              :key="color"
              :value="color"
            >
              {{ color }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <div slot="start" aria-hidden="true" class="i-ph-translate mr-3"></div>
          <ion-select
            :label="t('settings.appearance.language')" :placeholder="locale"
            @ion-change="handleLangChange"
          >
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
