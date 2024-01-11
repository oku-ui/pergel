<script setup lang="ts">
// import { useVuelidate } from '@vuelidate/core'
// import { email, minLength, minValue, required } from '@vuelidate/validators'

const { t } = useI18n()
const { user } = useMe()

const loading = ref(false)
/* -------------------------------------------------------------------------- */
/*                         Form with validation rules                         */
/* -------------------------------------------------------------------------- */
const formSchema = toTypedSchema(zod.object({
  email: zod.string().email(),
}))
const form = useForm({
  validationSchema: formSchema,
})

// const form = ref<{ email: string }>({
//   email: user.value?.email || '',
// })

// const showSave = computed(() => form.value.email.length > 0)

// const rules = {
//   email: { required, email },
// }
// const v$ = useVuelidate(rules, form)
/* -------------------------------------------------------------------------- */
/*                                    ----                                    */
/* -------------------------------------------------------------------------- */
const onSubmit = form.handleSubmit((values) => {
  loading.value = true
  /** save operations */

  console.info('form data: ', values)

  setTimeout(() => {
    loading.value = false
  }, 600)
})
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
      <form class="items-center p-10" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <ion-input v-bind="componentField" :label="t('auth.email')" label-placement="floating"></ion-input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <ion-button type="submit" :disabled="loading || !form.meta.value.valid" expand="full" shape="round">
          <span v-if="!loading">{{ t("settings.save") }}</span>
          <div v-if="!loading" slot="end" class="i-ph-check ml-5"></div>
          <ion-spinner v-else></ion-spinner>
        </ion-button>
      </form>
      <!-- <form class="items-center p-10" @submit.prevent="save">
        <div class="m-1">
          <ion-input v-model="v$.email.$model" :label="t('auth.email')" label-placement="floating"></ion-input>
          <div v-for="error of v$.email.$errors" :key="error.$uid" class="mt-5">
            <div :class="{ 'text-red-700': v$.email.$errors.length }" class="text-xs font-thin italic">
              {{ error.$message }}
            </div>
          </div>
        </div>

        <ion-button type="submit" :disabled="loading || !showSave || v$.$invalid" expand="full" shape="round">
          <span v-if="!loading">{{ t("settings.save") }}</span>
          <div v-if="!loading" slot="end" class="i-ph-check ml-5"></div>
          <ion-spinner v-else></ion-spinner>
        </ion-button>
      </form> -->
    </ion-content>
  </ion-page>
</template>
