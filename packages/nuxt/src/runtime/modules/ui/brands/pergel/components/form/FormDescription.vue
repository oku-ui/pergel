<script lang="ts" setup>
const { formDescriptionId } = useFormField()
</script>

<template>
  <p
    :id="formDescriptionId"
    :class="cn('mt-2 text-sm text-gray-500', $attrs.class ?? '')"
  >
    <slot />
  </p>
</template>
