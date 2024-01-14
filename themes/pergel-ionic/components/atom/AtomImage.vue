<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  image: {
    dark: string
    light: string
    alt?: string
    src?: string
  } | string
  alt?: string
}>()
</script>

<template>
  <template v-if="image">
    <img
      v-if="typeof image === 'string' || 'src' in image" class="AtomImage"
      v-bind="typeof image === 'string' ? $attrs : { ...image, ...$attrs }"
      :src="typeof image === 'string' ? image : image.src"
      :alt="alt ?? (typeof image === 'string' ? '' : image.alt || '')"
    >
    <template v-else>
      <AtomImage class="dark" :image="image.dark" :alt="image.alt" v-bind="$attrs" />
      <AtomImage class="light" :image="image.light" :alt="image.alt" v-bind="$attrs" />
    </template>
  </template>
</template>

<style scoped>
html:not(.dark) .AtomImage.dark {
    display: none;
}

.dark .AtomImage.light {
    display: none;
}
</style>
