<script setup lang="ts">
const { t } = useI18n()

const { initializeRevenueCat, purchasePackage } = await usePergelRevenueCat({
  apiKey: 'test',
  appUserID: 'test',
})

// Sayfa oluşturulduğunda RevenueCat'i başlat
onMounted(async () => {
  console.log('onmount')
  await initializeRevenueCat()
})
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
      <IonButton @click="purchasePackage">
        Satın Al
      </IonButton>
    </IonContent>
  </IonPage>
</template>
