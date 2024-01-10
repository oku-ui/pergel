<script setup lang="ts">
const { t } = useI18n()
const { user } = useMe()
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
      <ion-card>
        <ion-card-content>
          <ion-input :label="t('settings.personal.firstName')" label-placement="floating" fill="solid" :value="user?.firstName"></ion-input>
          <ion-input :label="t('settings.personal.lastName')" label-placement="floating" fill="solid" :value="user?.lastName"></ion-input>
          <ion-textarea :label="t('settings.personal.bio')" label-placement="floating" fill="solid" :value="user?.bio"></ion-textarea>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
