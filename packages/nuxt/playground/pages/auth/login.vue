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
  <NuxtLayout name="auth">
    <template #header>
      <AuthHeader
        link="/auth/signup"
        :title="t('auth.signup')"
      />
    </template>
    <template #left>
      <AuthLeft
        :logo="{
          src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
          alt: 'Your Company',
          link: '/',
        }"
        quote="This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
        footer="Sofia Davis"
      />
    </template>
    <template #content>
      <AuthForm
        :title="t('auth.signin')"
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
    </template>
  </NuxtLayout>
</template>
