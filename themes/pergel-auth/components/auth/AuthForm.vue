<script setup lang="ts">
interface AuthFormProps {
  title: string
  description: {
    label: string
    to?: string
    text?: string
  }
  terms: {
    label: string
    href: string
  }
  privacy: {
    label: string
    href: string
  }
  hiddenTerms?: boolean
}

withDefaults(defineProps<AuthFormProps>(), {
  title: 'Signin',
  description: () => ({
    label: 'Don\'t have an account?',
    to: '/auth/signup',
    text: 'Signup',
  }),
  terms: () => ({
    label: 'Terms of Service',
    href: '/auth/terms',
  }),
  privacy: () => ({
    label: 'Privacy Policy',
    href: '/auth/privacy',
  }),
})

const { t } = useI18n()
</script>

<template>
  <div class="lg:p-8">
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ title }}
        </h1>
        <p class="text-muted-foreground text-sm">
          {{ description.label }}
          <NuxtLink v-if="description.to" :to="description.to" class="hover:text-primary underline underline-offset-4">
            {{ description.text }}
          </NuxtLink>
        </p>
      </div>
      <slot />
      <p v-if="!hiddenTerms" class="text-muted-foreground px-8 text-center text-sm">
        {{ t('auth.terms_of_service_description') }}
        <NuxtLink
          :to="terms.href"
          class="hover:text-primary underline underline-offset-4"
        >
          {{ terms.label }}
        </NuxtLink>
        {{ t('and') }}
        <NuxtLink
          :to="privacy.href"
          class="hover:text-primary underline underline-offset-4"
        >
          {{ privacy.label }}
        </NuxtLink>
        .
      </p>
    </div>
  </div>
</template>
