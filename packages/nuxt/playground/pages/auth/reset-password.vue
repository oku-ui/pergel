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
  <NuxtLayout name="auth">
    <template #header>
      <AuthHeader
        :title="t('auth.login')"
        link="/auth/login"
      />
    </template>
    <template #left>
      <AuthLeft
        :logo="{
          src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
          link: '/',
          alt: 'Your Company',
        }"
        quote="This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
        footer="Sofia Davis"
      />
    </template>
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
  </NuxtLayout>
</template>
