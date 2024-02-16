// Credits: https://github.com/gbicou/nuxt-urql

import { join } from 'node:path'
import { addImportsDir, addPluginTemplate, addTemplate, createResolver, findPath } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig, generateModuleRuntimeConfigEnv } from '../../core/utils/moduleRuntimeConfig'
import { useNuxtImports } from '../../core/utils/useImports'
import type { ResolvedUrqlConfig, UrqlModuleOptions, UrqlModuleRuntimeConfig } from './types'

export default definePergelModule<UrqlModuleOptions, ResolvedUrqlConfig>({
  meta: {
    name: 'urql',
    version: '0.0.1',
    dependencies(_, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@urql/vue': deps['@urql/vue'],
        '@urql/core': deps['@urql/cozre'],
        '@urql/exchange-execute': deps['@urql/exchange-execute'],
        'graphql': deps.graphql,
        '@graphql-yoga/urql-exchange': deps['@graphql-yoga/urql-exchange'],
      }
    },
  },
  defaults: {
    endpoint: '',
    client: 'urql.config',
    ssr: { key: '__URQL_DATA__' },
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfigEnv(nuxt, options, {
      endpoint: undefined,
      default: {
        endpoint: 'http://localhost:3000/api/graphql',
      },
    })

    generateModuleRuntimeConfig<UrqlModuleRuntimeConfig>(nuxt, options, {
      endpoint: undefined,
      client: undefined,
      ssr: undefined,
      default: {
        endpoint: 'http://localhost:3000/api/graphql',
        client: 'urql.config',
        ssr: {
          key: '__URQL_DATA__',
        },
      },
    }, true)

    addImportsDir(resolver.resolve(join('plugins')))

    const urlClient = addTemplate({
      filename: join('pergel', options.folderName, 'client.ts'),
      write: true,
      getContents() {
        return /* ts */`import { type ClientOptions, type SSRExchange, cacheExchange, fetchExchange } from '@urql/core'
import { useRuntimeConfig } from '#app'

/**
 * client options except endpoint
 * @see {@link ClientOptions}
 */
export type UrqlClientOptions = Omit<ClientOptions, 'url'>

/**
 * helper to build client options from configured ssr
 * @param ssr - exchange configured to work with nuxt payload
 */
export type UrqlClientBuild = (ssr: SSRExchange) => PromiseLike<UrqlClientOptions> | UrqlClientOptions

/**
 * helper to define client options
 * @param f - client build options
 * @returns client options
 */
export const ${options.projectNameCamelCaseWithPergel}UrqlClient = (f: UrqlClientBuild) => f

/**
 * default client options and exchanges
 */
export default ${options.projectNameCamelCaseWithPergel}UrqlClient((ssr) => {
  // const { client } = useRuntimeConfig().public.urql
  const { selectProject } = usePergelRuntime({
    moduleName: 'urql',
    projectName: '${options.projectName}',
  }, undefined, true)

  if (!selectProject)
    throw new Error('Pergel is not defined')

  const options = typeof selectProject.client === 'string' ? {} : selectProject.client
  return {
    ...options,
    exchanges: process.server ? [ssr, fetchExchange] : [cacheExchange, ssr, fetchExchange],
  }
})

`
      },
    })

    // Load the client from the user's project
    const clientPath
      = typeof options.client === 'string'
        ? (await findPath(options.client)) ?? urlClient.dst
        : urlClient.dst
    nuxt.options.alias['#urql-client'] = clientPath

    nuxt.options.alias[`#${options.projectName}/client/urql`] = clientPath

    addPluginTemplate({
      filename: `${options.projectName}.urql.ts`,
      write: true,
      async getContents() {
        return /* ts */`import { ref, defineNuxtPlugin, useState, usePergelRuntime } from "#imports"
import { type Client, createClient, type SSRData, ssrExchange } from "@urql/core";
import nuxtURQLClient from '#${options.projectName}/client/urql'
import type { ResolvedUrqlConfig } from '#pergel/modules/urql/types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { selectProject } = usePergelRuntime({
    moduleName: 'urql',
    projectName: '${options.projectName}',
  }, undefined, true) as {
    selectProject: ResolvedUrqlConfig
  }

  if (!selectProject || !selectProject.client)
    throw new Error('Pergel is not defined')

  // create ssr exchange
  const ssr = ssrExchange({
    isClient: import.meta.client,
    ...selectProject.ssr,
  })

  // ssr data in nuxt state
  const ssrData = useState<SSRData>(selectProject.ssr.key || '__URQL_DATA__')

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
  const options = await nuxtURQLClient(ssr);

  // create urql client
  const client: Client = createClient({
    url: (import.meta.server && selectProject.ssr.endpoint) || selectProject.endpoint,
    ...options,
  })

  // provide client to @urql/vue
  nuxtApp.vueApp.provide('$urql', ref(client))

  return {
    provide: {
      urql: client,
    },
  }
})
        `
      },
    })

    useNuxtImports(nuxt, {
      presets: [
        {
          imports: [
            'gql',
            'useClientHandle',
            'useMutation',
            'useQuery',
            'useSubscription',
            'provideClient',
          ] as Array<keyof typeof import('@urql/vue')>,
          from: '@urql/vue',
        },
      ],
    })
  },
})

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    urql: {
      endpoint: string
    }
  }
}
