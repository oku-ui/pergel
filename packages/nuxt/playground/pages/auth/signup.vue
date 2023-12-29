<script setup lang="ts">
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
        title="Log in"
        link="/auth/login"
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
        title="Sign Up"
        :description="{
          label: 'Already have an account?',
          to: '/auth/login',
          text: 'Sign in',
        }"
        :terms="{
          href: '/auth/terms-of-service',
          label: 'Terms of Service',
        }"
        :privacy="{
          href: '/auth/privacy-policy',
          label: 'Privacy Policy',
        }"
      >
        <AuthFormSignup @submit="submit" />
      </AuthForm>
    </template>
  </NuxtLayout>
</template>
