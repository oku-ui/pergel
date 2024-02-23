<script setup lang="ts">
const user = useUser()
const { fetching } = useQuery({
  query: changeNameGraphQLClient.UsersDocument,
})
</script>

<template>
  <div>
    <h1>Home</h1>
    <div v-if="fetching">
      Loading...
    </div>
    {{ user?.id }}
    {{ user?.roleStatus }}
  </div>
</template>
