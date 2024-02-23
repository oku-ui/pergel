<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { executeMutation } = useMutation(changeNameGraphQLClient.LoginDocument)

async function submit(values: any, changeLoading: (value: boolean) => void) {
  try {
    const { data, error } = await executeMutation({
      input: {
        password: values.password,
        usernameOrEmail: values.username,
      },
    })
    if (error?.graphQLErrors)
      push.error(error.graphQLErrors[0].message)

    if (data?.login)
      router.push('/')
    else
      push.error('Signin failed')
  }
  catch (error) {
    push.error('Signin failed')
  }
  changeLoading(false)
}

function githubAuth() {
  window.location.href = '/api/login/github'
}

function googleAuth() {
  window.location.href = '/api/login/google'
}

const isActivated = computed(() => {
  return route.query?.activated === 'true'
})
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
          @github-click="githubAuth"
          @google-click="googleAuth"
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
