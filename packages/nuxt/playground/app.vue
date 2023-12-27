<script setup>

</script>

<template>
  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <div>
    <Signin />
  </div>
</template>
