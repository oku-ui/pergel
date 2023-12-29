<script setup lang="ts">
</script>

<template>
  <AuthLayout
    :logo="{
      src: 'https://raw.githubusercontent.com/oku-ui/static/main/logo/logo-white.svg',
      alt: 'Your Company',
    }"
  >
    <template v-for="(_, key) in useSlots()" #[key]>
      <slot :name="key" />
    </template>

    <slot />
  </AuthLayout>
</template>
