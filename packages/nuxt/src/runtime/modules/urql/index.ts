import { join } from 'node:path'
import { addImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { useNuxtImports } from '../../core/utils/useImports'
import type { UrqlModuleOptions, UrqlModuleRuntimeConfig } from './types'

export default definePergelModule<UrqlModuleOptions>({
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
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<UrqlModuleRuntimeConfig>(nuxt, options, {
      endpoint: undefined,
      default: {
        endpoint: 'http://localhost:3000/api/graphql',
      },
    }, true, true)

    addImportsDir(resolver.resolve(join('plugins')))

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

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function urql() {
            return {
              nuxtPlugin: (pergelUrqlPlugin).bind(ctx),
            }
          }
        `,
      resolve: /* ts */`
            urql: urql,
        `,
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
