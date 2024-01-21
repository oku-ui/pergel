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
  <IonRouterLink @click="to">
    <slot />
  </IonRouterLink>
</template>
