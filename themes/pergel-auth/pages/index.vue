<script setup lang="ts">
import { useQuery } from '@urql/vue'

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
