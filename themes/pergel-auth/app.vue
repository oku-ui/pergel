<script setup lang="ts">
import {
  darkTheme,
  lightTheme,
} from 'notivue'

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <Body class="h-full" />
  <Html class="h-full" />
  <Notivue v-slot="item">
    <Notifications :item="item" :theme="isDark ? darkTheme : lightTheme" />
  </Notivue>

  <NuxtLoadingIndicator />

  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="postcss">
@import url("~/assets/css/tailwind.css");
#__nuxt {
  @apply w-full h-full;
}
</style>
