<script setup lang="ts">
const route = useRoute()

const isActivated = route.query.activated === 'true'
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
  <iom-page name="auth">
    <AuthForm
      :title="t('auth.login')"
      :description="{
        label: t('auth.signup_description'),
        to: '/auth/signup',
        text: t('auth.signup'),
      }"
      :terms="{
        href: '/auth/terms-of-service',
        label: t('auth.terms_of_service'),
      }"
      :privacy="{
        href: '/auth/privacy-policy',
        label: t('auth.privacy_policy'),
      }"
      :hidden-terms="isActivated"
    >
      <AuthFormLogin
        v-if="!isActivated"
        @submit="submit"
      />
      <div v-else>
        <p class="text-sm">
          {{ t('auth.dont_have_an_account') }}
        </p>
      </div>
    </AuthForm>
  </iom-page>
</template>
