<script setup lang="ts">
interface AuthLeftProps {
  logo: {
    dark: string
    light: string
    alt: string
  }
}

withDefaults(defineProps<AuthLeftProps>(), {
  logo: () => {
    return {
      dark: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
      light: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-dark.svg',
      alt: 'Your Company',
    }
  },

})
</script>

<template>
  <div class="mb-14 h-40 bg-zinc-200 lg:hidden lg:bg-zinc-900 dark:bg-zinc-900">
    <div class="mt-auto flex h-full items-end px-4 text-lg font-medium">
      <AtomImage
        class="size-24"
        :image="{
          dark: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
          light: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-dark.svg',
        }"
      ></AtomImage>
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
