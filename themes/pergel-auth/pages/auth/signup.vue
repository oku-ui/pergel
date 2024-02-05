<script setup lang="ts">
import type { FormSchema } from '~/components/auth/AuthFormSignup.vue'
import { TesttestddDocument, XxxxxxDocument } from '#changeName/graphqlYoga/client'

console.log(TesttestddDocument)
const { data, executeMutation } = useMutation(XxxxxxDocument)

async function submit(values: FormSchema, loading: (value: boolean) => void) {
  // loading(true)
  // setTimeout(() => {
  //   loading(false)
  //   push.success('Signin success')
  // }, 1000)

  if (values) {
    await executeMutation({
      input: {
        email: values.email,
        name: values.username,
        password: values.password,
      },
    }).catch((error) => {
      console.error(error)
    }).then((response) => {
      console.log(response)
    })
  }
}
const { t } = useI18n()
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
          alt: 'Your Company',
          link: '/',
        }"
        quote="This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
        footer="Sofia Davis"
      />
    </template>
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
  </NuxtLayout>
</template>
