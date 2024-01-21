<script setup lang="ts">
import { faker } from '@faker-js/faker'
import type { SettingsItem } from '#types'

const { t } = useI18n()
const { user, setUser } = useMe()

const router = useIonRouter()
const searchText = ref('')

onMounted(() => {
  setUser({
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    bio: faker.person.bio(),
    username: faker.internet.userName(),
    avatar: faker.internet.avatar(),
  })
})

const settings = ref<SettingsItem[]>([
  { order: 0, name: t('settings.menu.account'), icon: 'i-ph-user', to: '/settings/account', subItems: [

  ] },
  { order: 1, name: t('settings.menu.notifications'), icon: 'i-ph-bell', to: '/settings/notifications' },
  { order: 2, name: t('settings.menu.appearance'), icon: 'i-ph-eye', to: '/settings/appearance', subItems: [
    { order: 0, name: t('settings.appearance.dark_mode'), icon: 'i-ph-moon-light', to: '/settings/appearance' },
    { order: 1, name: t('settings.appearance.language'), icon: 'i-ph-translate', to: '/settings/account' },
  ] },
  { order: 3, name: t('settings.menu.privacy'), icon: 'i-ph-lock-simple', to: '/settings/privacy' },
  { order: 4, name: t('settings.menu.help'), icon: 'i-ph-question', to: '/settings/help' },
  { order: 5, name: t('settings.menu.about'), icon: 'i-ph-headphones', to: '/settings/about' },
])

const settingsResults = ref<SettingsItem[]>(settings.value)

function handleSearch(event: any) {
  const query = event.target.value.toLowerCase()
  settingsResults.value = settings.value.filter(d => d.name.toLowerCase().includes(query) || (d.subItems?.filter(f => f.name.toLowerCase().includes(query)) || []).length > 0)
}
function itemClick(setting: SettingsItem) {
  router.push(setting.to)
}
</script>

<template>
  <IonPage>
    <IonHeader :translucent="true">
      <IonToolbar>
        <IonTitle class="justify-center text-center">
          {{ t("settings.title") }}
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" color="light">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large" class="justify-center text-center">
            {{ t("settings.title") }}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <the-header size="xs" :full-name="user?.fullName" :avatar="user?.avatar"></the-header>
      <div class="relative mt-2 flex items-center">
        <IonSearchbar v-model="searchText" :debounce="500" show-cancel-button="focus" cancel-button-text="Cancel" placeholder="Search" class="m-2" @ion-input="handleSearch($event)"></IonSearchbar>
      </div>
      <IonList v-if="searchText.length === 0" :inset="true" lines="inset">
        <IonItem v-for="setting in settingsResults" :key="setting.order" class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="itemClick(setting)">
          <div slot="start" aria-hidden="true" :class="setting.icon" class="mr-3"></div>
          {{ setting.name }}
        </IonItem>
      </IonList>
      <IonItem-group v-for="setting in settingsResults" v-else :key="setting.order" :button="true" class="justify-center font-semibold leading-6 text-gray-500 dark:text-white">
        <IonItem-divider>
          <IonLabel>
            {{ setting.name }}
          </IonLabel>
        </IonItem-divider>

        <IonItem v-for="subItem in setting.subItems" :key="subItem.order" class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="itemClick(setting)">
          <div slot="start" aria-hidden="true" :class="subItem.icon" class="mr-3"></div>
          {{ subItem.name }}
        </IonItem>
      </IonItem-group>
    </IonContent>
  </IonPage>
</template>
