<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const code = route.query.code as string | undefined

const success = ref(false)
const successReset = ref(false)
function submitEmail(values: any, loading: (value: boolean) => void) {
  loading(true)
  setTimeout(() => {
    loading(false)
    push.success('Send reset link')
    success.value = true
  }, 1000)
}

function resetPassword(values: any, loading: (value: boolean) => void) {
  loading(true)
  setTimeout(() => {
    loading(false)
    push.success('Success reset password')
    successReset.value = true
  }, 1000)
}
</script>

<template>
  <ion-page name="auth">
    <template #content>
      <AuthForm
        :title="code ? t('auth.reset_password') : t('auth.forgot_password')"
        :description="{
          label: code ? t('auth.reset_password_subtitle') : t('auth.forgot_password_subtitle'),
        }"
        hidden-terms
      >
        <AuthFormResetPassword
          v-if="!code"
          :success="success"
          @submit="submitEmail"
        />
        <AuthFormResetPasswordCode
          v-else
          :success="successReset"
          :login="{
            label: t('auth.back_to_login'),
            to: '/auth/login',
          }"
          :code="code"
          @submit="resetPassword"
        />
      </AuthForm>
    </template>
  </ion-page>
</template>
