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
        title="Sign up"
        link="/auth/signup"
      />
    </template>
    <template #left>
      <AuthLeft
        :logo="{
          src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
          alt: 'Your Company',
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
      >
        <AuthFormLogin
          @submit="submit"
        />
      </AuthForm>
    </template>
  </NuxtLayout>
</template>
