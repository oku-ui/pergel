import { resolve } from 'node:path'
import { addServerImportsDir, createResolver, useLogger } from '@nuxt/kit'
import defu from 'defu'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import type { ResolvedGraphqlConfig } from './types'
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
  defaults({ nuxt }) {
    const options = nuxt._pergel._module.options

    return defu(options, {
      documents: resolve(nuxt._pergel._module.moduleDir, options.documents ?? 'documents'),
      schema: resolve(nuxt._pergel._module.moduleDir, options.schema ?? 'schema'),
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
    } as ResolvedGraphqlConfig)
  },
  async setup({ nuxt }) {
    const module = nuxt._pergel._module

    const resolver = createResolver(import.meta.url)

    generateGraphQLTemplate({
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

    nuxt._pergel.contents.push({
      moduleName: module.moduleName,
      projectName: module.projectName,
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
