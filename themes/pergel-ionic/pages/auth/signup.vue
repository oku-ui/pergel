<script setup lang="ts">
function submit(values: any, loading: (value: boolean) => void) {
  loading(true)
  setTimeout(() => {
    loading(false)
    push.success('Signin success')
  }, 1000)
}
const { t } = useI18n()
</script>

<template>
  <ion-page name="auth">
    <template #content>
      <AuthForm
        :title="t('auth.signup')"
        :description="{
          label: t('auth.already_have_an_account'),
          to: '/auth/login',
          text: t('auth.login'),
        }"
        :terms="{
          href: '/auth/terms-of-service',
          label: t('auth.terms_of_service'),
        }"
        :privacy="{
          href: '/auth/privacy-policy',
          label: t('auth.privacy_policy'),
        }"
      >
        <AuthFormSignup @submit="submit" />
      </AuthForm>
    </template>
  </ion-page>
</template>
