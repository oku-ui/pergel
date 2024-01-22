<script setup lang="ts">
const { t } = useI18n()
const { user } = useMe()

const isLoading = ref(false)
/* -------------------------------------------------------------------------- */
/*                         Form with validation rules                         */
/* -------------------------------------------------------------------------- */

const formSchema = toTypedSchema(zod.object({
  newPassword: zod.string().min(8).max(50),
  confirmPassword: zod.string().min(8).max(50),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
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
      <the-header :full-name="user?.fullName" :avatar="user?.avatar" size="lg"></the-header>

      <form class="items-center p-10" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="newPassword">
          <FormItem>
            <FormLabel>
              {{ t('auth.password') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                type="password"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>
              {{ t('auth.confirm_password') }}
            </FormLabel>
            <FormControl>
              <AtomInput
                type="password"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <AtomButton class="w-full" :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 size-4 animate-spin" />
          {{ t('settings.save') }}
        </AtomButton>
      </form>
    </IonContent>
  </IonPage>
</template>
