<script setup lang="ts">
import { faker } from '@faker-js/faker'

const { t } = useI18n()
</script>

<template>
  <IonPage>
    <IonHeader :translucent="true">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton></IonBackButton>
        </IonButtons>
        <IonTitle class="justify-center text-center">
          {{ t("settings.general.notifications") }}
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" color="light">
      <IonList lines="inset">
        <IonListHeader>
          <IonLabel>
            {{ t("settings.general.notifications") }}
          </IonLabel>
          <IonButton>
            See All
          </IonButton>
        </IonListHeader>
        <IonItem :button="true" class="mt-5 border-l-2 border-red-400 p-5">
          <div slot="start" aria-hidden="true" class="i-ph-bell-ringing-fill size-5"></div>
          <IonLabel>
            Password reset
          </IonLabel>
          <IonNote slot="end">
            1 days
          </IonNote>
        </IonItem>
        <IonItem v-for="index in 10" :key="index" :button="true" class="mt-5 border-l-2 border-lime-400 p-5">
          <div slot="start" aria-hidden="true" class="i-ph-bell-ringing size-5"></div>
          <IonLabel>
            {{ faker.lorem.words() }}
          </IonLabel>
          <IonNote slot="end">
            {{ index }} days
          </IonNote>
        </IonItem>
      </Ionlist>
    </IonContent>
  </IonPage>
</template>
