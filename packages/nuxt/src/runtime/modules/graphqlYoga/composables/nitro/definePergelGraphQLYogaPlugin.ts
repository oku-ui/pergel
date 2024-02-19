import { eventHandler } from 'h3'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import type { GraphQLYogaOptions, ResolvedGraphQLYogaConfig } from '../../types'
import { nitroGraphqlYogaPlugin } from './nitroGraphqlYogaPlugin'
import { useRuntimeConfig } from '#imports'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export function definePergelGraphQLYogaPlugin<Context extends Record<string, any> = object>(
  this: PergelGlobalContextOmitModule,
  data: GraphQLYogaOptions<Context>,
) {
  return defineNitroPlugin(async (nitroApp) => {
    if (!this?.projectName)
      throw new Error('Missing config.projectName')

    const nitro = useRuntimeConfig()
    const yogaConfig = (nitro.public[this?.projectName] as any).graphqlYoga
    if (!yogaConfig)
      throw new Error('Missing config.graphqlYoga')

    const options = yogaConfig as ResolvedGraphQLYogaConfig

    if (import.meta.dev) {
      const graphqlVoyager = await import('../../plugins/voyager')
        .then(m => m.default)
        .catch(() => {
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
      eventHandler({
        handler: async (event) => {
          return await nitroGraphqlYogaPlugin(event, options, data)
        },
        onRequest: data.onRequest,
        onBeforeResponse: data.onBeforeResponse,
      }),
    )

    nitroApp.router.add(
      options.yogaConfig.health,
      eventHandler(async (event) => {
        return await nitroGraphqlYogaPlugin(event, options, data)
      }),
    )

    nitroApp.router.add(
      options.yogaConfig.ready,
      eventHandler(async (event) => {
        return await nitroGraphqlYogaPlugin(event, options, data)
      }),
    )
  })
}
