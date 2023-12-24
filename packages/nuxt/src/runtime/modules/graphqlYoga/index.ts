import { join, resolve } from 'node:path'
import { addServerImportsDir, createResolver } from '@nuxt/kit'
import defu from 'defu'
import { pascalCase } from 'scule'
import { definePergelModule } from '../../core/definePergel'
import { useNitroImports } from '../../core/utils/useImports'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { GraphQLYogaConfig, ResolvedGraphQLYogaConfig } from './types'
import { generateGraphQLTemplate } from './utils/generateGraphqlTemplate'

// const _logger = useLogger('pergel:graphql:yoga')

export default definePergelModule<GraphQLYogaConfig, ResolvedGraphQLYogaConfig>({
  meta: {
    name: 'graphqlYoga',
    version: '0.0.1',
    dependencies: {
      '@pergel/graphql': '0.0.0',
    },
    dts: true,
  },
  defaults({ nuxt, rootOptions }) {
    return defu(rootOptions, {
      documents: resolve(nuxt._pergel._module.moduleDir, rootOptions.documents ?? 'documents'),
      schema: resolve(nuxt._pergel._module.moduleDir, rootOptions.schema ?? 'schema'),
      codegen: {
        client: {
          extension: '.graphql',
          onlyDevelopment: true,
          configFilePath: resolve(nuxt._pergel._module.moduleDir, rootOptions.codegen?.client?.configFilePath ?? 'codegen/client.ts'),
        },
        server: {
          extension: '.graphql',
          onlyDevelopment: true,
          configFilePath: resolve(nuxt._pergel._module.moduleDir, rootOptions.codegen?.server?.configFilePath ?? 'codegen/server.ts'),
        },
      },
      endpoint: '/api/graphql',
      plugins: {
        playground: {
          endpoint: '/api/graphql',
        },
        voyager: {
          endpoint: '/api/graphql/voyager',
          playgroundEndpoint: '/api/graphql',
        },
        sandbox: {
          endpoint: '/api/graphql/sandbox',
          playgroundEndpoint: '/api/graphql',
        },
      },
      yogaConfig: {
        health: '/api/graphql/health',
        ready: '/api/graphql/ready',
      },
      mergeSchemas: false,
    } satisfies ResolvedGraphQLYogaConfig) as ResolvedGraphQLYogaConfig
  },
  async setup({ nuxt, options }) {
    const module = nuxt._pergel._module

    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<ResolvedGraphQLYogaConfig>(nuxt, {
      ...options,
    }, true)

    addServerImportsDir(resolver.resolve('./composables/**'))

    addServerImportsDir(join(nuxt.options.buildDir, 'pergel', module.projectName, module.moduleName, 'client'))

    useNitroImports(nuxt, {
      presets: [
        {
          from: 'graphql',
          imports: ['GraphQLError'],
        },
        {
          from: join(nuxt.options.buildDir, 'pergel', module.projectName, module.moduleName, 'client'),
          imports: [
            {
              as: `${module.projectName}${pascalCase(module.moduleName)}Document`,
              name: '*',
            },
          ],
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

    generateGraphQLTemplate({
      nuxt,
      options,
    })

    nuxt._pergel.contents.push({
      moduleName: module.moduleName,
      projectName: module.projectName,
      content: /* ts */`
          function graphqlYoga() {
            return {
              nitro: () => {
                return {
                  use: (definePergelGraphQLYogaPlugin<GraphqlYogaContext>).bind(ctx)
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
