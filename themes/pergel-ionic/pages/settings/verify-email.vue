<script setup lang="ts">
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
      <IonCard class="mt-40">
        <IonCard-content class="relative mx-auto w-full rounded-2xl bg-white px-6 pb-9 shadow-xl">
          <div class="flex flex-col items-center justify-center space-y-2 text-center">
            <div class="text-3xl font-semibold">
              <p> {{ t("auth.email_verification") }}</p>
            </div>
            <div class="flex flex-row text-sm font-medium text-gray-400">
              <p> {{ t("auth.we_send_code") }}</p>
            </div>
          </div>

          <div class="mt-5">
            <form action="" method="post">
              <div class="flex flex-col space-y-16">
                <div class="mx-auto flex w-full max-w-xs flex-row items-center justify-between">
                  <div class="size-16 ">
                    <input id="" class="flex size-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="size-16 ">
                    <input id="" class="flex size-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="size-16 ">
                    <input id="" class="flex size-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="size-16 ">
                    <input id="" class="flex size-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                </div>

                <div class="flex flex-col items-center space-y-5">
                  <div>
                    <IonButton>
                      {{ t("auth.verify_account") }}
                    </IonButton>
                  </div>

                  <div class="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
                    <p>{{ t("auth.didnt_receive") }}</p> <a class="flex flex-row items-center text-blue-600" href="#" rel="noopener noreferrer">Resend</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </IonCard-content>
      </IonCard>
    </IonContent>
  </IonPage>
</template>
