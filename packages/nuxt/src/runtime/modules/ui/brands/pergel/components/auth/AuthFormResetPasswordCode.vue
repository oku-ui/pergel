<script setup lang="ts">
interface AuthFormProps {
  success: boolean
}
withDefaults(defineProps<AuthFormProps>(), {
  success: false,
})

const emit = defineEmits<Emit>()

const isLoading = ref(false)

const formSchema = toTypedSchema(zod.object({
  email: zod.string().email(),
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
    <form v-if="!success" @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <AtomInput
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <AtomButton :disabled="isLoading">
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 h-4 w-4 animate-spin" />
          Send reset link
          <AtomIcon dynamic name="i-ph-arrow-right-bold" class="ml-2 h-4 w-4" />
        </AtomButton>
      </div>
    </form>
    <div v-else>
      <div class="grid gap-3">
        <div class="grid gap-1">
          <p class="text-sm">
            We have sent you an email with a link to reset your password. Please check your inbox. If you don't see the email, check other places it might be, like your junk, spam, social, or other folders.
          </p>
        </div>
      </div>
    </div>

    <AtomButton
      variant="outline"
      type="button"
      class="mt-4"
      @click="$router.back()"
    >
      <AtomIcon dynamic name="i-ph-arrow-left-bold" class="mr-2 h-4 w-4" />
      Back
    </AtomButton>
  </div>
</template>
