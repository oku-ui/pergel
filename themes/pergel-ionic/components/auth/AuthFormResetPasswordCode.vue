<script setup lang="ts">
interface AuthFormProps {
  success: boolean
  code: string
  login: {
    label: string
    to: string
  }
}
const props = withDefaults(defineProps<AuthFormProps>(), {
  success: false,
})

const emit = defineEmits<Emit>()
const { t } = useI18n()
const { buttonVariants } = useVariants()

const isLoading = ref(false)

const formSchema = toTypedSchema(zod.object({
  code: zod.string().min(2).max(50),
  newPassword: zod.string().min(8).max(50),
  confirmPassword: zod.string().min(8).max(50),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}),

)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    code: props.code,
  },
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
          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel>
                {{ t('auth.code') }}
              </FormLabel>
              <FormControl>
                <AtomInput
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="newPassword">
            <FormItem>
              <FormLabel>
                {{ t('auth.new_password') }}
              </FormLabel>
              <FormControl>
                <AtomInput
                  type="password"
                  autocomplete="new-password"
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

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>
                {{ t('auth.confirm_new_password') }}
              </FormLabel>
              <FormControl>
                <AtomInput
                  type="password"
                  autocomplete="new-password"
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
          {{ t('auth.reset_password') }}
        </AtomButton>
      </div>
    </form>
    <div v-else>
      <div class="grid gap-3">
        <div class="grid gap-1">
          <p class="mb-4 text-sm">
            {{ t('auth.reset_password_success') }}
          </p>
          <IonLink
            :to="login.to"
            :class="cn(
              buttonVariants({ variant: 'outline' }),
              '',
            )"
          >
            {{ login.label }}
          </IonLink>
        </div>
      </div>
    </div>
  </div>
</template>
