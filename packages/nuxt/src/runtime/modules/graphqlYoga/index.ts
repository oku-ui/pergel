import { resolve } from 'node:path'
import { addServerImportsDir, createResolver, useLogger } from '@nuxt/kit'
import defu from 'defu'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import type { ResolvedPergelOptions } from '../../core/types'
import type { GraphQLConfig, ResolvedGraphqlConfig } from './types'
import { generateGraphQLTemplate } from './utils/generateGraphqlTemplate'

const _logger = useLogger('pergel:graphql:yoga')

export default definePergelModule<ResolvedGraphqlConfig>({
  meta: {
    name: 'graphqlYoga',
    version: '0.0.1',
    dependencies: {
      '@pergel/graphql': '0.0.0',
    },
  },
  defaults(nuxt, options) {
    return {
      documents: resolve(options.resolvedModule.moduleDir, 'documents'),
      schema: resolve(options.resolvedModule.moduleDir, 'schema'),
      codegen: {
        client: {
          extension: '.graphql',
          onlyDevelopment: true,
        },
        server: {
          extension: '.graphql',
          onlyDevelopment: true,
        },
      },
    }
  },
  async setup(options, nuxt) {
    const projectName = options.resolvedModule.projectName

    const resolver = createResolver(import.meta.url)

    generateGraphQLTemplate({
      options,
      nuxt,
    })

    addServerImportsDir(resolver.resolve('./composables/**'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'graphql',
          imports: ['GraphQLError'],
        },
        {
          from: 'graphql-relay',
          imports: ['connectionFromArraySlice'],
        },
        {
          from: 'ts-relay-cursor-paging',
          imports: [
            'offsetForArgs',
            {
              type: true,
              name: 'DefaultConnectionArguments',
            },
          ],
        },
      ],
    })

    options._contents.push({
      moduleName: 'graphqlYoga',
      projectName,
      content: /* ts */`
          function graphqlYoga() {
            return {
              nitro: () => {
                return {
                  use: definePergelGraphQLYogaPlugin.bind(ctx)
                }
              },
            }
          }
        `,
      resolve: /* ts */`
            graphqlYoga: graphqlYoga,
        `,
    })
  },
})
