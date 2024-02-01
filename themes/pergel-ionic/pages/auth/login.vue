<script setup lang="ts">
definePageMeta({
  alias: ['/'],
})
const route = useRoute()
const router = useIonRouter()
const isActivated = route.query.activated === 'true'
function submit(values: any, loading: (value: boolean) => void) {
  loading(true)
  setTimeout(() => {
    loading(false)
    push.success('Signin success')
    router.push('/tabs/profile')
  }, 1000)
}

const { t } = useI18n()
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <!-- <TwPattern /> -->

      <div class="bg-background/75 border-codGray-200  dark:border-codGray-800 sticky top-0 z-50 -mb-px mt-28  overflow-auto border-b p-10 backdrop-blur-sm backdrop-filter md:backdrop-blur-none lg:mb-0 lg:border-0">
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
      </div>
    </IonContent>
  </IonPage>
</template>
