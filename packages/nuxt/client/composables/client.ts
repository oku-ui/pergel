import type { NuxtDevtoolsClient, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, VueInspectorData } from '@nuxt/devtools-kit/types'
import type { Unhead } from '@unhead/schema'

export function useClient() {
  return useState<NuxtDevtoolsHostClient>('devtools-client')
}

export function useClientRoute(): ComputedRef<ReturnType<typeof useRoute>> {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$route)
}

export function useClientRouter(): ComputedRef<ReturnType<typeof useRouter>> {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$router)
}

export function useClientHead() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$head as Unhead)
}

export function useComponentInspectorData() {
  return useState<VueInspectorData>('devtools-component-inspector-data')
}

const connectionTimeout = ref(false)
setTimeout(() => {
  connectionTimeout.value = true
}, 2000)

export const showConnectionWarning = computed(() => {
  return connectionTimeout.value && !useClient().value
})

export function useInjectionClient(): ComputedRef {
  const client = useClient()
  const mode = useColorMode()

  return computed(() => ({
    host: client.value,
    devtools: {
      rpc,
      colorMode: mode.value,
    },
  }))
}
