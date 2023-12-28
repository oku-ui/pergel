<script lang="ts" setup>
import { computed } from 'vue'
import { useAppConfig } from '#imports'

const props = defineProps<{
  name: string
  dynamic?: boolean
}>()

const dynamic = computed(() => props.dynamic || useAppConfig().ui?.icons?.dynamic)
</script>

<template>
  <Icon v-if="dynamic" :name="name" />
  <span v-else :class="name" />
</template>
