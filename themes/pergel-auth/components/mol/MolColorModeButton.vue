<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
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
      aria-label="change color mode"
      :class="cn(
        $attrs.class ?? '',
      )"
      @click="isDark = !isDark"
    >
      <AtomIcon dynamic :name="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" class="size-4" />
    </button>

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
