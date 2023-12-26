<script lang="ts" setup>
import { provide } from 'vue'
import { useId } from '@oku-ui/use-composable'

// import { cn } from '#pergel/ui/composables/utils'
// import { useFormField } from '#pergel/ui/composables/useFormField'

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)

const { error } = useFormField()
</script>

<template>
  <div :class="cn('mt-2', $attrs.class ?? '')">
    <slot :error="error"></slot>
  </div>
</template>
