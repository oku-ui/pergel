<script setup>
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
  <Notivue
    v-slot="item"
  >
    <Notifications
      :item="item"
      :theme="isDark ? darkTheme : lightTheme"
    />
  </Notivue>

  <div class="h-full">
    <div v-confetti="{ particleCount: 200, force: 0.3 }" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
#__nuxt {
  @apply w-full h-full;
}
</style>
