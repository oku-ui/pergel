<script setup lang="ts">
const { t } = useI18n()
const { user } = useMe()
const router = useIonRouter()
function navigateTo(path: string) {
  router.push(path)
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
          {{ t("settings.account.title") }}
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" color="light">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large" class="justify-center text-center">
            {{ t("settings.account.title") }}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <the-header :full-name="user?.fullName" :avatar="user?.avatar" size="lg"></the-header>

      <IonList :inset="true" lines="inset">
        <IonItem class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="navigateTo('/settings/personal')">
          <div slot="start" aria-hidden="true" class="i-ph-user mr-3"></div>
          {{ t("settings.account.personal_info") }}
        </IonItem>
        <IonItem class="justify-center rounded-md p-2 text-sm font-semibold leading-6  text-gray-500 dark:text-white" :button="true" :detail="true" @click="navigateTo('/settings/email')">
          <div slot="start" aria-hidden="true" class="i-ph-envelope-simple mr-3"></div>
          {{ t("settings.account.email_address") }}
        </IonItem>
        <IonItem class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="navigateTo('/settings/password')">
          <div slot="start" aria-hidden="true" class="i-ph-password mr-3"></div>
          {{ t("settings.account.change_password") }}
        </IonItem>
        <IonItem class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="navigateTo('/settings/verify-email')">
          <div slot="start" aria-hidden="true" class="i-ph-check-circle mr-3"></div>
          {{ t("settings.account.verify_email") }}
        </IonItem>
        <IonItem class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="false">
          <div slot="start" aria-hidden="true" class="i-ph-list-checks mr-3"></div>
          {{ t("settings.account.where_youre_signed") }}
          <p class="mt-2 text-xs font-thin">
            {{ t("settings.account.see_your_active_sessions") }}
          </p>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>
