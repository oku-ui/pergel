<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { minLength, required, sameAs } from '@vuelidate/validators'

const { t } = useI18n()
const { user } = useMe()

const loading = ref(false)
/* -------------------------------------------------------------------------- */
/*                         Form with validation rules                         */
/* -------------------------------------------------------------------------- */
const form = ref<{ password: string, confirmPassword: string }>({
  password: '',
  confirmPassword: '',
})

const rules = {
  password: { required, minLength: minLength(6) },
  confirmPassword: {
    required,
    sameAsRef: sameAs(computed(() => form.value.password)), // can be a reference to a field or computed property
  },
}
const v$ = useVuelidate(rules, form)
/* -------------------------------------------------------------------------- */
/*                                    ----                                    */
/* -------------------------------------------------------------------------- */
function save() {
  loading.value = true
  /** save operations */

  console.info('form data: ', form.value)

  setTimeout(() => {
    loading.value = false
  }, 600)
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

      <form class="items-center p-10" @submit.prevent="save">
        <div class="m-1">
          <ion-input v-model="v$.password.$model" :label="t('auth.password')" label-placement="floating"></ion-input>
          <div v-for="error of v$.password.$errors" :key="error.$uid" class="mt-5">
            <div :class="{ 'text-red-700': v$.password.$errors.length }" class="text-xs font-thin italic">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div class="m-1">
          <ion-input v-model="v$.confirmPassword.$model" :label="t('auth.confirm_password')" label-placement="floating"></ion-input>
          <div v-for="error of v$.confirmPassword.$errors" :key="error.$uid" class="mt-5">
            <div :class="{ 'text-red-700': v$.confirmPassword.$errors.length }" class="text-xs font-thin italic">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <ion-button type="submit" :disabled="loading || v$.$invalid" expand="full" shape="round">
          <span v-if="!loading">{{ t("settings.save") }}</span>
          <div v-if="!loading" slot="end" class="i-ph-check ml-5"></div>
          <ion-spinner v-else></ion-spinner>
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>
