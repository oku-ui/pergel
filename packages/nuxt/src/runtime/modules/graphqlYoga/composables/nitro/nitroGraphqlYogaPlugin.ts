import { createSchema, createYoga, useReadinessCheck } from 'graphql-yoga'
import type { YogaServerInstance, YogaServerOptions } from 'graphql-yoga'
import type { H3Event } from 'h3'
import { mergeSchemas } from '@graphql-tools/schema'
import { parseURL } from 'ufo'
import type { GraphQLYogaOptions, GraphqlYogaContextOptions, GraphqlYogaHandleOptions, ResolvedGraphQLYogaConfig } from '../../types'

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      user: String
    }
  `,
  resolvers: {
    Query: {
      user: () => 'https://oku-ui.com/pergel',
    },
  },
})

const yogaStore: Map<string, {
  instance: YogaServerInstance<any, any> | null
  context: Partial<any> | null
}> = new Map()

export async function nitroGraphqlYogaPlugin<Context extends Record<string, any> = object>(event: H3Event, config: ResolvedGraphQLYogaConfig, {
  onAfterOptions,
  onBeforeContext,
  onBeforeOptions,
}: Omit<GraphQLYogaOptions<Context>, 'config'>) {
  const { pathname } = parseURL(event.path)

  if (!yogaStore.has(pathname)) {
    yogaStore.set(pathname, {
      instance: null,
      context: null,
    })

    let graphQLOptions: Partial<YogaServerOptions<any, any>> = {
      graphqlEndpoint: config.endpoint,
      healthCheckEndpoint: config.yogaConfig.health,
      schema,
      plugins: [
        useReadinessCheck({
          endpoint: config.yogaConfig.ready,
          check: () => {
            console.warn('check')
          },
        }),
      ],
    }

    const beforeHandle: GraphqlYogaHandleOptions = {
      context: {
        event,
      },
      options: {
        add(options) {
          graphQLOptions = {
            ...graphQLOptions,
            ...options,
            schema: config?.mergeSchemas
              ? mergeSchemas({
                schemas: options.schema ? [schema, options.schema as any] : [schema],
              })
              : options.schema || schema,
          }
        },
      },
    }

    await onBeforeOptions?.(beforeHandle)

    // Create Yoga instance
    const yogaInstance = createYoga(graphQLOptions)

    await onAfterOptions?.(yogaInstance)
    let context: Partial<Context> = {}

    const beforeHandleContext: GraphqlYogaContextOptions<Context> = {
      context: {
        event,
      },
      options: {
        add(options) {
          context = {
            ...context,
            ...options,
          }

          return context
        },
      },
    }

    await onBeforeContext?.(beforeHandleContext)

    yogaStore.set(pathname, {
      instance: yogaInstance,
      context,
    })
  }
  const { req, res } = event.node

  return yogaStore.get(pathname)!.instance!.handle(req, res, {
    ...yogaStore.get(pathname)!.context,
    event,
  })
}
