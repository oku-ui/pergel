<script setup lang="ts">
const emit = defineEmits<Emit>()

const isLoading = ref(false)

const formSchema = toTypedSchema(zod.object({
  username: zod.string().min(2).max(50),
  email: zod.string().email(),
  password: zod.string().min(8).max(50),
  passwordConfirm: zod.string().min(8).max(50),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
}),

)

const form = useForm({
  validationSchema: formSchema,
})

type Emit = {
  submit: [values: zod.infer<typeof formSchema>, loading: (value: boolean) => void]
  githubButton: []
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
              <FormItem>
                {{ t('auth.username') }}
              </FormItem>
              <FormControl>
                <AtomInput
                  v-bind="componentField"
                  required
                  :disabled="isLoading"
                  autocomplete="username"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {{ t('auth.username_input_subtitle') }}
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>
                {{ t('auth.email') }}
              </FormLabel>
              <FormControl>
                <AtomInput
                  type="email"
                  autocomplete="email"
                  required
                  :disabled="isLoading"
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
              <FormDescription>
                {{ t('auth.password_input_subtitle') }}
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="passwordConfirm">
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
        </div>
        <AtomButton :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('auth.signup_with_email') }}
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
      variant="outline" type="button" :disabled="isLoading"
      @click="emit('githubButton')"
    >
      <AtomIcon dynamic name="i-simple-icons-github" class="mr-2 h-4 w-4" />
      <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
      GitHub
    </AtomButton>
  </div>
</template>
