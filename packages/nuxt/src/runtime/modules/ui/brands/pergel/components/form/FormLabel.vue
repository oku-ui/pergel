<script lang="ts" setup>
import { type LabelProps, OkuLabel } from '@oku-ui/label'

defineProps<LabelProps>()

const { error, formItemId } = useFormField()
</script>

<template>
  <OkuLabel
    :class="cn(
      'block text-sm font-medium leading-6',
      error && 'text-destructive',
      $attrs.class ?? '',
    )"
    :for="formItemId"
  >
    <slot />
  </OkuLabel>
</template>
