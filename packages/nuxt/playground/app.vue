<script setup>

</script>

<template>
  <Body class="h-full" />
  <Html class="h-full bg-zinc-950" />
  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
#__nuxt {
  @apply w-full h-full;
}
</style>
