<script setup lang="ts">
interface AuthFormProps {
  success: boolean
}
withDefaults(defineProps<AuthFormProps>(), {
  success: false,
})

const emit = defineEmits<Emit>()
const { t } = useI18n()

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
              <FormLabel>
                {{ t('auth.email') }}
              </FormLabel>
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
          <AtomIcon v-if="isLoading" dynamic name="i-ph-circle-notch-bold" class="mr-2 size-4 animate-spin" />
          {{ t('auth.send_reset_link') }}
          <AtomIcon dynamic name="i-ph-arrow-right-bold" class="ml-2 size-4" />
        </AtomButton>
      </div>
    </form>
    <div v-else>
      <div class="grid gap-3">
        <div class="grid gap-1">
          <p class="text-sm">
            {{ t('auth.reset_password_email_sent') }}
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
      <AtomIcon dynamic name="i-ph-arrow-left-bold" class="mr-2 size-4" />
      Back
      {{ t('auth.back') }}
    </AtomButton>
  </div>
</template>
