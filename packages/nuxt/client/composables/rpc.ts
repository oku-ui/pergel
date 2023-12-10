import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { BirpcReturn } from 'birpc'
import { ref } from 'vue'
import type { NuxtDevtoolsClient } from '@nuxt/devtools-kit/dist/types'
import type { ClientFunctions, ServerFunctions } from '../../src/types'
import { DEVTOOLS_RPC_NAMESPACE } from '../../src/constants'

export const devtools = ref<NuxtDevtoolsClient>()
export const devtoolsRpc = ref<NuxtDevtoolsClient['rpc']>()
export const rpc = ref<BirpcReturn<ServerFunctions, ClientFunctions>>()

onDevtoolsClientConnected(async (client) => {
  devtoolsRpc.value = client.devtools.rpc
  devtools.value = client.devtools

  rpc.value = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(DEVTOOLS_RPC_NAMESPACE, {
  })
})
