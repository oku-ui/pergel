<script lang="ts" setup>
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

import { rpc } from '../composables/rpc'
import { options } from '../composables/state'

const client = useDevtoolsClient()

async function getOptions() {
  options.value = await rpc.value?.getOptions()
  console.warn(client.value, 'client')
}
</script>

<template>
  <div class="relative p-10 n-bg-base flex flex-col h-screen">
    {{ JSON.stringify(options) }}
    <h1 class="text-3xl font-bold">
      My Module
    </h1>
    <div class="opacity-50 mb-4">
      Nuxt DevTools Integration
    </div>
    <div flex="~ gap-2">
      <NButton n="green" class="mt-4" @click="client!.host.devtools.close()">
        Close DevTools
      </NButton>

      <NButton n="green" class="mt-4" @click="getOptions()">
        Get DevTools Options
      </NButton>
    </div>
  </div>
</template>
