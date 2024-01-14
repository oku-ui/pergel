<script setup lang="ts">
definePageMeta({
  path: '/',
})
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
  <ion-page>
    <div class="relative z-0">
      <div
        class="absolute -left-40 h-0 w-0
  border-x-[200px] border-t-[230px]
  border-x-transparent border-t-yellow-500"
      >
      </div>
      <div
        class="absolute -left-10 ml-10 h-0 w-0
  border-x-[200px] border-t-[200px]
  border-x-transparent border-t-yellow-500"
      >
      </div>
      <div
        class="absolute -right-10 ml-10 h-0 w-0
  border-x-[200px] border-t-[250px]
  border-x-transparent border-t-yellow-500"
      >
      </div>
      <div
        class="absolute -right-40 h-0 w-0
  border-x-[200px] border-t-[200px]
  border-x-transparent border-t-yellow-500"
      >
      </div>
    </div>

    <div class="bg-background/75 border-codGray-200  dark:border-codGray-800 sticky top-0 z-50 -mb-px mt-5 border-b p-10 backdrop-blur-sm backdrop-filter md:backdrop-blur-none lg:mb-0 lg:border-0">
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
        class="text-gray-700"
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
    </div>
  </ion-page>
</template>
