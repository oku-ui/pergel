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
  <ion-page>
    <BgPattern />
    <div class="bg-background/75 border-codGray-200  dark:border-codGray-800 sticky top-0 z-50 -mb-px mt-5 overflow-auto border-b p-10 backdrop-blur-sm backdrop-filter md:backdrop-blur-none lg:mb-0 lg:border-0">
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
    </div>
  </ion-page>
</template>
