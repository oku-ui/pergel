// Credits: https://github.com/gbicou/nuxt-urql

import { basename, join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { addImportsDir, addPluginTemplate, addTemplate, createResolver, findPath } from '@nuxt/kit'
import { globbySync } from 'globby'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig, generateModuleRuntimeConfigEnv } from '../../core/utils/moduleRuntimeConfig'
import { useNuxtImports } from '../../core/utils/useImports'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
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
        '@urql/exchange-graphcache': deps['@urql/exchange-graphcache'],
      }
    },
  },
  defaults: {
    endpoint: '',
    client: undefined,
    ssr: { key: '__URQL_DATA__' },
    driver: 'graphqlYoga',
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
import type { ResolvedUrqlConfig } from '#pergel/modules/urql/types'
import { usePergelRuntime } from '#imports'

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
  const { selectProject } = usePergelRuntime({
    moduleName: 'urql',
    projectName: '${options.projectName}',
  }, undefined, true) as {
    selectProject: ResolvedUrqlConfig
  }

  if (!selectProject)
    throw new Error('Pergel is not defined')

  const options = selectProject.client === 'custom' ? {} : selectProject.client
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
      = options.client === 'custom'
        ? (await findPath(options.client)) ?? urlClient.dst
        : urlClient.dst
    nuxt.options.alias['#urql-client'] = clientPath

    addPluginTemplate({
      filename: `${options.projectName}.urql.ts`,
      write: true,
      async getContents() {
        return /* ts */`import { ref, defineNuxtPlugin, useState, usePergelRuntime } from "#imports"
import type { Client, SSRData } from "@urql/core"
import { createClient, ssrExchange } from "@urql/core";
import nuxtURQLClient from '#urql-client'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { selectProject } = usePergelRuntime({
    moduleName: 'urql',
    projectName: '${options.projectName}',
  }, undefined, true)

  if (!selectProject)
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

    if (nuxt._pergel.projects[options.projectName]?.drizzle && nuxt._pergel.projects[options.projectName]?.lucia) {
      if (!existsSync(resolve(options.serverDir, 'index.ts'))) {
        const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, '**/*')), {
          onlyFiles: true,
        })

        for (const file of files) {
          const readFile = await nuxt._pergel.jitiDyanmicImport(file)
          if (readFile) {
            const fileData = readFile({
              projectName: options.projectName,
              projectNameCamelCaseWithPergel: options.projectNameCamelCaseWithPergel,
              nuxt,
              driver: options.driver,
            })
            const fileName = basename(file)

            writeFilePergel(resolve(options.rootModuleDir, fileName), fileData)
          }
        }
      }
    }

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
        {
          from: urlClient.dst,
          imports: [
            `${options.projectNameCamelCaseWithPergel}UrqlClient`,
          ],
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
