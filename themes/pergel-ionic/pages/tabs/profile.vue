<script setup lang="ts">
import { faker } from '@faker-js/faker'

const { isDark, setThemeColor } = useSettings()
const { t } = useI18n()
const { user, setUser } = useMe()
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
function toggledDark() {
  console.log(isDark.value)
  if (isDark.value === 'light')
    setThemeColor({ detail: { value: 'dark' } })
  else
    setThemeColor({ detail: { value: 'light' } })
}
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <TwPattern></TwPattern>
      <div class="relative flex h-screen justify-center p-20">
        <IonAvatar class="border-1 absolute flex size-32 items-center justify-center border">
          <img class="size-28" src="assets/images/profile.jpg" />
        </IonAvatar>
        <IonLabel class="absolute mt-36 text-2xl font-semibold">
          {{ user?.fullName }}
        </IonLabel>
        <IonButton class="absolute mt-44 h-24 p-5" color="primary" shape="round">
          {{ t("profile.edit_profile") }}
        </IonButton>
        <div class="absolute mt-72 w-full p-10">
          <IonNote>
            {{ t("settings.appearance.title") }}
          </IonNote>
          <IonItem>
            <IonToggle :checked="isDark === 'dark'" @ion-change="toggledDark">
              <IonLabel>
                {{ t("settings.appearance.dark_mode") }}
              </IonLabel>
            </IonToggle>
          </IonItem>
          <IonNote>
            {{ t("profile.invite_link") }}
          </IonNote>
          <IonItem>
            <IonLabel slot="start" text="">
              {{ t("profile.invite_people") }}
            </IonLabel>
            <IonButton slot="end" shape="round">
              {{ t("profile.invite") }}
            </IonButton>
          </IonItem>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>
