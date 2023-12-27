<script setup lang="ts">
import type { PrimitiveProps } from '@oku-ui/primitive'
import { OkuPrimitive } from '@oku-ui/primitive'

const { buttonVariants } = useVariants()
interface Props extends PrimitiveProps {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <OkuPrimitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')">
    <slot />
  </OkuPrimitive>
</template>
