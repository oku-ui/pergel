<script setup lang="ts">
const { t } = useI18n()
const { user } = useMe()

const isLoading = ref(false)
/* -------------------------------------------------------------------------- */
/*                         Form with validation rules                         */
/* -------------------------------------------------------------------------- */

const formSchema = toTypedSchema(zod.object({
  username: zod.string().min(5),
  firstName: zod.string(),
  lastName: zod.string(),
  bio: zod.string().nullable(),
}))
const form = useForm({
  validationSchema: formSchema,
})
/* -------------------------------------------------------------------------- */
/*                                    ----                                    */
/* -------------------------------------------------------------------------- */
const onSubmit = form.handleSubmit((values) => {
  isLoading.value = true
  /** save operations */

  console.info('form data: ', values)

  setTimeout(() => {
    isLoading.value = false
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

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" class="justify-center text-center">
            {{ t("settings.account.title") }}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <the-header :full-name="user?.fullName" :avatar="user?.avatar" size="lg"></the-header>

      <form class="items-center p-10" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>
              {{ t('auth.username') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem>
            <FormLabel>
              {{ t('settings.personal.firstName') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem>
            <FormLabel>
              {{ t('settings.personal.lastName') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="bio">
          <FormItem>
            <FormLabel>
              {{ t('settings.personal.bio') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <AtomButton class="w-full" :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('settings.save') }}
        </AtomButton>
      </form>
    </ion-content>
  </ion-page>
</template>
