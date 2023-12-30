<script lang="ts" setup>
import { useId } from '@oku-ui/use-composable'

const { formItemInject } = useInjects()
const id = useId()
provide(formItemInject, id)

const { error } = useFormField(false)
</script>

<template>
  <div :class="cn('mt-2', $attrs.class ?? '')">
    <slot :error="error"></slot>
  </div>
</template>
