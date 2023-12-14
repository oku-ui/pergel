import { eventHandler } from 'h3'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import defu from 'defu'
import type { GraphQLYogaOptions, ResolvedGraphQLNitroPluginConfig } from '../../types'
import { nitroGraphqlYogaPlugin } from './nitroGraphqlYogaPlugin'

export function definePergelGraphQLYogaPlugin<Context extends Record<string, any> = object>(data: GraphQLYogaOptions<Context>) {
  return defineNitroPlugin(async (nitroApp) => {
    const options = defu(data.config, {
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
    } as ResolvedGraphQLNitroPluginConfig) as ResolvedGraphQLNitroPluginConfig

    // generateGraphQLTemplate({
    //   schema: options.schema,
    //   documents: options.documents,
    //   mergeSchemas: options.mergeSchemas,
    // })

    // console.log('import.meta.dev', import.meta.dev)
    // console.log('process.dev', process.dev)

    // TODO: user maybe wants to disable or enable playground
    if (process.dev) {
      const graphqlVoyager = await import('../../plugins/voyager').then(m => m.default).catch(() => {
        console.warn('Failed to load GraphQL Voyager plugin')
      })
      if (graphqlVoyager) {
        nitroApp.router.add(
          options.plugins.voyager.endpoint,
          graphqlVoyager({
            endpointUrl: options.plugins.voyager.playgroundEndpoint,
          }),
        )
      }

      const apolloSandbox = await import('../../plugins/apolloSandbox').then(m => m.default).catch(() => {
        console.warn('Failed to load Apollo Sandbox plugin')
      })

      if (apolloSandbox) {
        nitroApp.router.add(
          options.plugins.sandbox.endpoint,
          apolloSandbox({
            _initialEndpoint: options.plugins.sandbox.playgroundEndpoint,
          }),
        )
      }
    }

    nitroApp.router.add(
      options.endpoint,
      eventHandler(async (event) => {
        await nitroGraphqlYogaPlugin(event, options, data)
      }),
    )

    nitroApp.router.add(
      options.yogaConfig.health,
      eventHandler(async (event) => {
        await nitroGraphqlYogaPlugin(event, options, data)
      }),
    )

    nitroApp.router.add(
      options.yogaConfig.ready,
      eventHandler(async (event) => {
        await nitroGraphqlYogaPlugin(event, options, data)
      }),
    )
  })
}
