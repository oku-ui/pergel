<script setup lang="ts">
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
  <ClientOnly>
    <button
      aria-label="Theme"
      :class="cn(
        $attrs.class ?? '',
      )"
      @click="isDark = !isDark"
    >
      <AtomIcon dynamic :name="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" class="h-4 w-4" />
    </button>

    <template #fallback>
      <div class="h-8 w-8" />
    </template>
  </ClientOnly>
</template>
