<script setup lang="ts">
import { computed } from 'vue'
import type { SelectChangeEventDetail } from '@ionic/vue'
import type { IonSelectCustomEvent } from '@ionic/core'
import type { LocaleObject } from '#types'

const { isDark, colors, setThemeColor } = useSettings()
const { locale, locales, t, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value as LocaleObject[]).filter((i: any) => i.code !== locale.value)
})

function handleLangChange(ev: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
  const detailValue = ev.detail.value as string
  localStorage.setItem('locale', detailValue)
  locale.value = detailValue
  document.documentElement.lang = detailValue
  setLocale(detailValue)
  // window.location.reload()
}
</script>

<template>
  <IonPage>
    <IonHeader :translucent="true">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton></IonBackButton>
        </IonButtons>
        <IonTitle class="justify-center text-center">
          {{ t("settings.appearance.title") }}
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <IonList :inset="true" lines="inset">
        <IonItem>
          <div slot="start" aria-hidden="true" class="mr-3">
            <AtomIcon :name="isDark ? 'i-ph-moon' : 'i-ph-sun'" class="h-4 w-4" />
          </div>
          <IonSelect
            :label="t('settings.appearance.dark_mode')"
            :placeholder="isDark"
            @ion-change="setThemeColor"
          >
            <IonSelect-option
              v-for="color in colors"
              :key="color"
              :value="color"
            >
              {{ color }}
            </IonSelect-option>
          </IonSelect>
        </IonItem>
        <IonItem>
          <div slot="start" aria-hidden="true" class="i-ph-translate mr-3"></div>
          <IonSelect
            :label="t('settings.appearance.language')" :placeholder="locale"
            @ion-change="handleLangChange"
          >
            <IonSelect-option v-for="lang in availableLocales" :key="lang.code" :value="lang.code">
              {{
                lang.name
              }}
            </IonSelect-option>
          </IonSelect>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>
