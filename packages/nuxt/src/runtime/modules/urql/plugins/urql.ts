import type { Client, ClientOptions, SSRData, SSRExchange, SSRExchangeParams } from '@urql/core'
import { cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/core'
import { yogaExchange } from '@graphql-yoga/urql-exchange'
import { usePergelRuntime } from '../../../core/utils/usePergelRuntime'
import type { UrqlModuleRuntimeConfig } from '../types'
import { defineNuxtPlugin, ref, useState } from '#imports'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export type UrqlClientOptions = Omit<ClientOptions, 'url'>

let cacheUrqlClient: Client

export function pergelUrqlPlugin(
  this: PergelGlobalContextOmitModule,
  params?: {
    config: UrqlClientOptions
    ssr: SSRExchangeParams
    ssrParams: {
      key: string
      endpoint: string
    }
    context?: PergelGlobalContextOmitModule
  },
) {
  const urqlClient = async (ssr: SSRExchange) => {
    return {
      ...params,
      exchanges:
        import.meta.server
          ? [ssr, fetchExchange, yogaExchange()]
          : [cacheExchange, ssr, fetchExchange, yogaExchange()],
    } as UrqlClientOptions
  }
  const context = params?.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  return defineNuxtPlugin(async (nuxtApp: any) => {
    const { selectProject } = usePergelRuntime<UrqlModuleRuntimeConfig>({
      moduleName: 'urql',
      projectName: context.projectName,
    }, undefined, true)

    // create ssr exchange
    const ssr = ssrExchange({
      isClient: import.meta.client,
      ...params?.ssr,
    })

    // ssr data in nuxt state
    const ssrData = useState<SSRData>(params?.ssrParams.key || '__URQL_DATA__')

    // when app is created in browser, restore SSR state from nuxt payload
    if (import.meta.client) {
      nuxtApp.hook('app:created', () => {
        ssr.restoreData(ssrData.value)
      })
    }

    // when app has rendered in server, send SSR state to client
    if (import.meta.server) {
      nuxtApp.hook('app:rendered', () => {
        ssrData.value = ssr.extractData()
      })
    }

    // retrieve user client options to create client
    const options = await urqlClient(ssr)

    // create urql client
    const client: Client = createClient({
      url: (import.meta.server && params?.ssrParams.endpoint) || selectProject.endpoint,
      ...options,
    })

    if (client)
      cacheUrqlClient = client

    // provide client to @urql/vue
    nuxtApp.vueApp.provide('$urql', ref(client))

    return {
      provide: {
        urql: client,
      },
    }
  })
}

export function useUrqlClient() {
  return cacheUrqlClient
}
