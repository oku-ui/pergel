<script lang="ts" setup>
</script>

<template>
  <input
    :class="cn(
      'block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6',
      error && 'ring-destructive',
      $attrs.class ?? '',
    )"
  >
</template>
