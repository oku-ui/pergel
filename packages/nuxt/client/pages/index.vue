<script setup lang="ts">
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

const client = useDevtoolsClient()
const { pergelRpc } = usePergelRpc()

// onMounted(async () => {
//   if (pergelRpc.value) {
//     const data = await pergelRpc.value.()
//     console.log(data)
//   }
// })
</script>

<template>
  <NSectionBlock
    icon="carbon-3d-mpr-toggle"
    text="Active Modules"
    container-class="grid grid-cols-minmax-400px gap3 px4"
    :padding="false"
    description="Total modules: "
  >
    hello test
  </NSectionBlock>
  <div class="relative p-10 n-bg-base flex flex-col h-screen">
    <h1 class="text-3xl font-bold">
      Pergel Module
    </h1>
    <div class="opacity-50 mb-4">
      Powered by oku
    </div>
    <div
      v-if="client"
      class="flex flex-col gap-2"
    >
      <NTip
        n="green"
        icon="carbon-checkmark"
      >
        Nuxt DevTools is connected
      </NTip>
      <div>
        The current app is using
        <code class="text-green">vue@{{ client.host.nuxt.vueApp.version }}</code>
      </div>
      <div>
        <NButton
          n="green"
          class="mt-4"
          @click="client!.host.devtools.close()"
        >
          Close DevTools
        </NButton>
      </div>
    </div>
    <div v-else>
      <NTip n="yellow">
        Failed to connect to the client. Did you open this page inside Nuxt DevTools?
      </NTip>
    </div>

    <NuxtLink
      to="/s3"
      class="absolute top-0 right-0 p-4"
    >
      Go to S3
    </NuxtLink>

    <div class="flex-auto" />
    <ModuleAuthorNote class="mt-5 " />
  </div>
</template>
