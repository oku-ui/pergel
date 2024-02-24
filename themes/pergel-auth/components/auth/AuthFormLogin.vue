<script setup lang="ts">
const emit = defineEmits<Emit>()
const { t } = useI18n()
const isLoading = ref(false)

const zodSchema = zod.object({
  username: zod.string().min(2).max(50),
  password: zod.string().min(8).max(50),
})

const formSchema = toTypedSchema(zodSchema)

const form = useForm({
  validationSchema: formSchema,
})

type Emit = {
  submit: [values: Zod.infer<typeof zodSchema>, loading: (value: boolean) => void]
  githubClick: []
  googleClick: []
}

function changeLoading(value: boolean) {
  isLoading.value = value
}

const onSubmit = form.handleSubmit((values) => {
  isLoading.value = true
  emit('submit', values, changeLoading)
})
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
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

          <FormField v-slot="{ componentField }" name="password">
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
              <FormDescription class="pb-4 text-right">
                {{ t('auth.forgot_password_question') }}
                <NuxtLink to="/auth/reset-password" class="hover:text-primary underline underline-offset-4">
                  {{ t('auth.forgot_password') }}
                </NuxtLink>
              </FormDescription>
            </FormItem>
          </FormField>
        </div>
        <AtomButton :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 size-4 animate-spin" />
          {{ t('auth.login_with_email') }}
        </AtomButton>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background text-muted-foreground px-2">
          {{ t('auth.or_continue_with') }}
        </span>
      </div>
    </div>
    <AtomButton
      variant="outline"
      type="button"
      :disabled="isLoading"
      @click="emit('githubClick')"
    >
      <AtomIcon dynamic name="i-simple-icons-github" class="mr-2 size-4" />
      <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 size-4 animate-spin" />
      GitHub
    </AtomButton>
    <!-- Google -->
    <AtomButton
      variant="outline"
      type="button"
      :disabled="isLoading"
      @click="emit('googleClick')"
    >
      <AtomIcon dynamic name="i-simple-icons-google" class="mr-2 size-4" />
      <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 size-4 animate-spin" />
      Google
    </AtomButton>
  </div>
</template>
