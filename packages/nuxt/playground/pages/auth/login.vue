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
</script>

<template>
  <NuxtLayout name="auth">
    <template #header>
      <AuthHeader
        title="Sign up"
        link="/auth/signup"
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
        title="Log in"
        :description="{
          label: 'Don\'t have an account?',
          to: '/auth/signup',
          text: 'Sign up',
        }"
        :terms="{
          href: '/auth/terms-of-service',
          label: 'Terms of Service',
        }"
        :privacy="{
          href: '/auth/privacy-policy',
          label: 'Privacy Policy',
        }"
        :hidden-terms="isActivated"
      >
        <AuthFormLogin
          v-if="!isActivated"
          @submit="submit"
        />
        <div v-else>
          <p class="text-sm">
            Your account is not activated yet. You have been put on the waiting list. We will notify you when your account is ready.
            Thank you for your patience.
          </p>
        </div>
      </AuthForm>
    </template>
  </NuxtLayout>
</template>
