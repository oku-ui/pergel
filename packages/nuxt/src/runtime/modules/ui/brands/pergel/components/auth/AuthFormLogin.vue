<script setup lang="ts">
const emit = defineEmits<Emit>()

const isLoading = ref(false)

const formSchema = toTypedSchema(zod.object({
  username: zod.string().min(2).max(50),
  password: zod.string().min(8).max(50),
}))

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
              <FormLabel>Username</FormLabel>
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
              <FormLabel>Password</FormLabel>
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
                Forgot your password? <NuxtLink to="/auth/reset-password" class="hover:text-primary underline underline-offset-4">
                  Reset it
                </NuxtLink>
              </FormDescription>
            </FormItem>
          </FormField>
        </div>
        <AtomButton :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
          Log in with email
        </AtomButton>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background text-muted-foreground px-2">
          Or continue with
        </span>
      </div>
    </div>
    <AtomButton
      variant="outline"
      type="button"
      :disabled="isLoading"
      @click="emit('githubButton')"
    >
      <AtomIcon dynamic name="i-simple-icons-github" class="mr-2 h-4 w-4" />
      <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
      GitHub
    </AtomButton>
  </div>
</template>
