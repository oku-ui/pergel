<script setup lang="ts">
interface AuthLeftProps {
  logo: {
    src: string
    alt: string
    link: string
  }
  quote: string
  footer: string
}

withDefaults(defineProps<AuthLeftProps>(), {
  logo: () => {
    return {
      src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
      alt: 'Your Company',
      link: '/',
    }
  },
  quote: 'This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.',
  footer: 'Sofia Davis',
})
</script>

<template>
  <div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
    <div class="absolute inset-0 bg-zinc-900" />
    <div class="relative z-20 flex items-center text-lg font-medium">
      <NuxtLink
        class="flex items-center space-x-2"
        :to="logo.link"
      >
        <img
          class="mr-2 size-24"
          :src="logo.src"
          :alt="logo.alt"
        >
      </NuxtLink>
    </div>
    <div class="relative z-20 mt-auto">
      <blockquote class="space-y-2">
        <p class="text-lg">
          &ldquo;{{ quote }}&rdquo;
        </p>
        <footer class="text-sm">
          {{ footer }}
        </footer>
      </blockquote>
    </div>
  </div>
</template>
