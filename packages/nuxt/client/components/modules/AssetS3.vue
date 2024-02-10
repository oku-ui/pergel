<script setup lang="ts">
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
})

definePageMeta({
  icon: 'carbon-image-copy',
  title: 'S3',
})

const { data, error, pending, execute } = await useFetch<any[]>(devtoolsUrl('/__pergel__S3', props.projectName), {
  method: 'get',
  lazy: true,
})

const selected = ref()
const search = ref('')
const navbar = ref()
</script>

<template>
  <div h-full of-auto>
    <NNavbar ref="navbar" v-model:search="search" pb2>
      <template #actions>
        <NButton
          :disabled="pending"
          icon="carbon:rocket"
          @click="execute"
        >
          Refresh
        </NButton>
      </template>
      <div op50>
        <span>{{ data?.length }} assets in total</span>
      </div>
    </NNavbar>

    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
    <NLoading v-if="pending">
      Getting data from S3...
    </NLoading>
    <AssetListItem v-for="item, key of data" v-else :key="key" v-model="selected" :item="item" />
  </div>
</template>
