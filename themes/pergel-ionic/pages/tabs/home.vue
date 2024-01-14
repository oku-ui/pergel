<script setup lang="ts">
const isLoading = ref(true)
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Toolbar</IonTitle>
        <IonProgressBar v-if="isLoading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent :fullscreen="true">
      <TwPattern></TwPattern>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            My Dashboard
          </IonCardTitle>
          <IonCardSubtitle>
            Details my app
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div class="flex flex-col items-center bg-gray-400/5 p-8">
            <dt class="text-sm font-semibold leading-6 text-gray-600">
              Creators on the platform
            </dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              8,000+
            </dd>
          </div>
        </IonCardContent>
      </IonCard>

      <ul role="list" class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg  text-center shadow">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                My Dashboard
              </IonCardTitle>
              <IonCardSubtitle>
                Details my app
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div class="flex flex-col items-center bg-gray-400/5 p-8">
                <dt class="text-sm font-semibold leading-6 text-gray-600">
                  Creators on the platform
                </dt>
                <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  8,000+
                </dd>
              </div>
            </IonCardContent>
          </IonCard>
        </li>
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg text-center shadow">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                My Dashboard
              </IonCardTitle>
              <IonCardSubtitle>
                Details my app
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div class="flex flex-col items-center bg-gray-400/5 p-8">
                <dt class="text-sm font-semibold leading-6 text-gray-600">
                  Creators on the platform
                </dt>
                <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  8,000+
                </dd>
              </div>
            </IonCardContent>
          </IonCard>
        </li>
      </ul>
    </IonContent>
  </IonPage>
</template>
