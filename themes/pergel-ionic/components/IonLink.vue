<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    default: '/',
  },
})
const router = useIonRouter()
function to() {
  // Diğer sayfaya yönlendirme
  router.push(props.to)
}
</script>

<template>
  <ion-router-link @click="to">
    <slot />
  </ion-router-link>
</template>
