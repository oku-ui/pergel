import { ref } from 'vue'
import type { BirpcReturn } from 'birpc'
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions } from '../../src/rpc-types'

const RPC_NAMESPACE = 'oku-pergel-rpc'

const pergelRpc = ref<BirpcReturn<ServerFunctions>>()

export function usePergelRpc() {
  return {
    pergelRpc,
  }
}
onDevtoolsClientConnected(async (client) => {
  console.log('onDevtoolsClientConnected')
  const rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(RPC_NAMESPACE, {
    showNotification(message) {
      console.log('message', message)
    },
  })

  console.log('rpc', rpc)

  rpc.getMyModuleOptions().then((options) => {
    console.log('options', options)
  })
})
