import type { YogaServerInstance, YogaServerOptions } from 'graphql-yoga'
import type { H3Error, H3Event } from 'h3'

import type { EmbeddableSandboxOptions } from '@apollo/sandbox/src/EmbeddedSandbox'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'
import type { CodegenClientConfig, CodegenServerConfig } from './utils/codegen'

export interface GraphqlYogaHandleOptions {
  context: {
    event: H3Event
  }
  options: {
    add: (options: YogaServerOptions<any, any>) => void
  }
}

export interface GraphqlYogaContextOptions<Context extends Record<string, any> = object> {
  context: {
    event: H3Event
  }
  options: {
    add: (options: Partial<Context>) => Promise<Partial<Context>> | Partial<Context>
  }
}

export interface GraphQLYogaConfig extends PergelModuleOptions {
  /**
   * GraphQL endpoint
   * @default '/api/graphql'
   */
  endpoint?: string

  /**
   * Merge schemas
   * @default false
   * @see https://www.graphql-tools.com/docs/schema-merging
   * @example true
   * @example false
   */
  mergeSchemas?: boolean

  /**
   * GraphQL schemas
   * @default 'pergel/${projectName}/graphql'
   */
  schemaDir?: string

  /**
   * GraphQL resolvers
   * @default 'graphql'
   */
  documentDir?: string

  yogaConfig?: {
    /**
     * Health check endpoint
     * Auto append to `graphqlEndpoint` + `health`
     * @default '/api/graphql/health'
     */
    health?: string

    /**
     * Health check endpoint
     * Auto append to `graphqlEndpoint` + `ready`
     * @default '/api/graphql/ready'
     */
    ready?: string
  }

  plugins?: {
    /**
     * GraphQL playground
     * @default true
     */
    playground?: boolean | {
      /**
       * GraphQL playground endpoint
       * @default '/api/graphql'
       */
      endpoint?: string
    }

    /**
     * GraphQL voyager
     * @default true
     */
    voyager?: false | {
      /**
       * GraphQL voyager endpoint
       * @default '/api/graphql/voyager'
       */
      endpoint?: string

      /**
       * GraphQL voyager playground endpoint
       * @default '/api/graphql'
       */
      playgroundEndpoint?: string
    }

    /**
     * GraphQL sandbox
     * @default true
     */
    sandbox?: false | {
      /**
       * GraphQL sandbox endpoint
       * @default '/api/graphql/sandbox'
       */
      endpoint?: string

      /**
       * GraphQL sandbox playground endpoint
       * @default '/api/graphql'
       */
      playgroundEndpoint?: string
    }
  }

  codegen?: {
    /**
     * Server codegen
     * @default true
     */
    server?: {
      /**
       * Codegen config file path
       * @default 'codegen.yml'
       */
      configFilePath?: string

      /**
       * Only generate codegen in development mode
       * @default true
       */
      onlyDevelopment?: boolean

      /**
       * Codegen file extension
       * @default '.graphql'
       */
      extension?: '.graphql' | '.gql'

      /**
       * Codegen config
       * @default undefined
       */
      config?: (args: {
        dir: {
          /**
           * server/graphqlYoga-{projectName}
           */
          module: string

          /**
           * server
           */
          server: string
          /**
           * .nuxt/pergel/${projectName}/graphqlYoga
           */
          nuxtModule: string
        }
      }) => CodegenServerConfig
    }

    /**
     * Client codegen
     * @default true
     */
    client?: {
      /**
       * Codegen config file path
       * @default 'codegen.yml'
       */
      configFilePath?: string

      /**
       * Only generate codegen in development mode
       * @default true
       */
      onlyDevelopment?: boolean

      /**
       * Codegen file extension
       * @default '.graphql'
       */
      extension?: '.graphql' | '.gql'

      /**
       * Codegen config
       * @default undefined
       */
      config?: (args: {
        dir: {
          /**
           * server/graphqlYoga-{projectName}
           */
          module: string

          /**
           * server
           */
          server: string
          /**
           * .nuxt/pergel/${projectName}/graphqlYoga
           */
          nuxtModule: string
        }
      }) => CodegenClientConfig
    }
  }
}

export interface ResolvedGraphQLYogaConfig extends GraphQLYogaConfig, ResolvedPergelModuleOptions {
  endpoint: string
  mergeSchemas: boolean
  schemaDir: string
  documentDir: string

  yogaConfig: {
    health: string
    ready: string
  }

  dir: {
    schema: string
    document: string
  }

  plugins: {
    playground: {
      endpoint: string
    }
    voyager: {
      endpoint: string
      playgroundEndpoint: string
    }
    sandbox: {
      endpoint: string
      playgroundEndpoint: string
    }
  }
  codegen: {
    server: {
      configFilePath: string
      onlyDevelopment: boolean
      extension: '.graphql' | '.gql'
      config?: (args: {
        dir: {
          /**
           * server/graphqlYoga-{projectName}
           */
          module: string

          /**
           * server
           */
          server: string
          /**
           * .nuxt/pergel/${projectName}/graphqlYoga
           */
          nuxtModule: string
        }
      }) => CodegenServerConfig
    }
    client: {
      configFilePath: string
      onlyDevelopment: boolean
      extension: '.graphql' | '.gql'
      config?: (args: {
        dir: {
          /**
           * server/graphqlYoga-{projectName}
           */
          module: string

          /**
           * server
           */
          server: string
          /**
           * .nuxt/pergel/${projectName}/graphqlYoga
           */
          nuxtModule: string
        }
      }) => CodegenClientConfig
    }
  }
}

export interface GraphQLYogaOptions<Context extends Record<string, any> = object> {
  onSuccess?: (event: H3Event, result: { user: any, tokens: any }) => Promise<void> | void
  onError?: (event: H3Event, error: H3Error) => Promise<void> | void
  onBeforeOptions?: (options: GraphqlYogaHandleOptions, event: H3Event) => Promise<void> | void
  onAfterOptions?: (serverInstance: YogaServerInstance<any, any>, event: H3Event) => Promise<void> | void
  onBeforeContext?: (options: GraphqlYogaContextOptions<Context>, event: H3Event) => Promise<void> | void
}

export interface ApolloSandBoxOptions extends Omit<EmbeddableSandboxOptions, 'target' | 'initialEndpoint'> {
  _target?: string | HTMLElement
  _initialEndpoint?: string
}

export interface VoyagerMiddlewareOptions {
  endpointUrl: string
  displayOptions?: {
    rootType?: string
    skipRelay?: boolean
    skipDeprecated?: boolean
    showLeafFields?: boolean
    sortByAlphabet?: boolean
    hideRoot?: boolean
  }
  headersJS?: string
}
