<script setup lang="ts">
const { t } = useI18n()
const { user } = useMe()
const router = useRouter()
function navigateTo(path: string) {
  router.push(path)
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
          {{ t("settings.account.title") }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" color="light">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="justify-center text-center">
            {{ t("settings.account.title") }}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <the-header :full-name="user?.fullName" :avatar="user?.avatar" size="lg"></the-header>

      <ion-list :inset="true" lines="inset">
        <ion-item class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true" @click="navigateTo('/settings/personal')">
          <div slot="start" aria-hidden="true" class="i-ph-user mr-3"></div>
          {{ t("settings.account.personal_info") }}
        </ion-item>
        <ion-item class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true">
          <div slot="start" aria-hidden="true" class="i-ph-envelope-simple mr-3"></div>
          {{ t("settings.account.email_address") }}
        </ion-item>
        <ion-item class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true">
          <div slot="start" aria-hidden="true" class="i-ph-password mr-3"></div>
          {{ t("settings.account.change_password") }}
        </ion-item>
        <ion-item class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="true">
          <div slot="start" aria-hidden="true" class="i-ph-check-circle mr-3"></div>
          {{ t("settings.account.verify_email") }}
        </ion-item>
        <ion-item class="justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 dark:text-white" :button="true" :detail="false">
          <div slot="start" aria-hidden="true" class="i-ph-list-checks mr-3"></div>
          {{ t("settings.account.where_youre_signed") }}
          <p class="mt-2 text-xs font-thin">
            {{ t("settings.account.see_your_active_sessions") }}
          </p>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
