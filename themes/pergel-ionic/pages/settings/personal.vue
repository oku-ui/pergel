<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

import type { User } from '#types'

const { t } = useI18n()
const { user } = useMe()

const loading = ref(false)
/* -------------------------------------------------------------------------- */
/*                         Form with validation rules                         */
/* -------------------------------------------------------------------------- */
const form = ref<User>(user.value || {
  username: '',
  firstName: '',
  lastName: '',
  bio: '',
})

const showSave = computed(() => form.value.firstName.length > 0 && form.value.lastName.length > 0)

const rules = {
  username: { required, minLength: minLength(5) },
  firstName: { required },
  lastName: { required },
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

    <ion-content :fullscreen="true">
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
          <ion-input v-model="v$.username.$model" :label="t('auth.username')" label-placement="floating"></ion-input>
          <div v-for="error of v$.username.$errors" :key="error.$uid" class="mt-5">
            <div :class="{ 'text-red-700': v$.username.$errors.length }" class="text-xs font-thin italic">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div class="m-1">
          <ion-input v-model="v$.firstName.$model" :label="t('settings.personal.firstName')" label-placement="floating"></ion-input>
          <div v-for="error of v$.firstName.$errors" :key="error.$uid" :class="{ 'text-red-700': v$.firstName.$errors.length }" class="text-xs font-thin italic">
            <div class="error-msg">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div class="m-1">
          <ion-input v-model="v$.lastName.$model" :label="t('settings.personal.lastName')" label-placement="floating"></ion-input>
          <div v-for="error of v$.lastName.$errors" :key="error.$uid" class="input-errors">
            <div :class="{ 'text-red-700': v$.lastName.$errors.length }" class="text-xs font-thin italic">
              {{ error.$message }}
            </div>
          </div>
        </div>

        <ion-textarea v-model="form.bio" class="m-1" :label="t('settings.personal.bio')" label-placement="floating"></ion-textarea>
        <ion-button type="submit" :disabled="loading || !showSave || v$.$invalid" expand="full" shape="round">
          <span v-if="!loading">{{ t("settings.save") }}</span>
          <div v-if="!loading" slot="end" class="i-ph-check ml-5"></div>
          <ion-spinner v-else></ion-spinner>
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>
