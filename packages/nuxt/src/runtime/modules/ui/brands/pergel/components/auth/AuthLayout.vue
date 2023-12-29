<script setup lang="ts">
interface AuthLeftProps {
  logo: {
    src: string
    alt: string
  }
}

withDefaults(defineProps<AuthLeftProps>(), {
  logo: () => {
    return {
      src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
      alt: 'Your Company',
    }
  },

})
</script>

<template>
  <div class="mb-14 h-40 bg-zinc-900 lg:hidden">
    <div class="mt-auto flex h-full items-end px-4 text-lg font-medium">
      <img
        class="mr-2 h-24 w-24"
        :src="logo.src"
        :alt="logo.alt"
      >
    </div>
  </div>

  <div
    class="container h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <slot name="header"></slot>
    <slot name="left"></slot>
    <slot name="content"></slot>
  </div>
</template>
