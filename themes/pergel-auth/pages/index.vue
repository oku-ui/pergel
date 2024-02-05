<script setup lang="ts">
const { data, fetching } = useQuery({
  query: changeNameGraphQLClient.UsersDocument,
})
</script>

<template>
  <div>
    test
    {{ fetching }}
    {{ data }}
  </div>
</template>
