<script setup lang="ts">
const { t } = useI18n()
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
      <ion-card class="mt-40">
        <ion-card-content class="relative mx-auto w-full rounded-2xl bg-white px-6 pb-9 shadow-xl">
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
                  <div class="h-16 w-16 ">
                    <input id="" class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="h-16 w-16 ">
                    <input id="" class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="h-16 w-16 ">
                    <input id="" class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                  <div class="h-16 w-16 ">
                    <input id="" class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1" type="text" name="">
                  </div>
                </div>

                <div class="flex flex-col items-center space-y-5">
                  <div>
                    <ion-button>
                      {{ t("auth.verify_account") }}
                    </ion-button>
                  </div>

                  <div class="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
                    <p>{{ t("auth.didnt_receive") }}</p> <a class="flex flex-row items-center text-blue-600" href="#" rel="noopener noreferrer">Resend</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
