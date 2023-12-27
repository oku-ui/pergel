<script setup lang="ts">
const isLoading = ref(false)

const formSchema = toTypedSchema(zod.object({
  username: zod.string().min(2).max(50),
  password: zod.string().min(8).max(50),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  push.success('Hello from your first notification!')
})
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <AtomInput
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <Label class="sr-only" for="email">
            Email
          </Label>
          <Input
            id="email" placeholder="name@example.com" type="email" auto-capitalize="none"
            auto-complete="email" auto-correct="off" :disabled="isLoading"
          /> -->
        </div>
        <AtomButton :disabled="isLoading">
          <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
          Sign In with Email
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
    <AtomButton variant="outline" type="button" :disabled="isLoading">
      <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
      <!-- <GitHubLogo v-else class="mr-2 h-4 w-4" /> -->
      GitHub
    </AtomButton>
  </div>
</template>
