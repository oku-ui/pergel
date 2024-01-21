<script setup lang="ts">
import type { PrimitiveProps } from '@oku-ui/primitive'
import { OkuPrimitive } from '@oku-ui/primitive'

withDefaults(defineProps<Props>(), {
  as: 'button',
})
const { buttonVariants } = useVariants()
interface Props extends PrimitiveProps {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  as?: string
}
</script>

<template>
  <OkuPrimitive.button
    :as-child="asChild" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </OkuPrimitive.button>
</template>
