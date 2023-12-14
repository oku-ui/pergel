import type { YogaServerInstance, YogaServerOptions } from 'graphql-yoga'
import type { H3Error, H3Event } from 'h3'

import type { EmbeddableSandboxOptions } from '@apollo/sandbox/src/EmbeddedSandbox'

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

export interface GraphQLConfig {
  /**
   * GraphQL schemas
   * @default 'pergel/${projectName}/graphql/schema'
   */
  schema?: string

  /**
   * GraphQL resolvers
   * @default 'pergel/${projectName}/graphql/documents'
   */
  documents?: string

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
    }
  }
}

export interface ResolvedGraphqlConfig extends GraphQLConfig {
  schema: string
  documents: string
  codegen: {
    server: {
      configFilePath?: string
      onlyDevelopment: boolean
      extension: '.graphql' | '.gql'
    }
    client: {
      configFilePath?: string
      onlyDevelopment: boolean
      extension: '.graphql' | '.gql'
    }
  }
}

export interface GraphQLNitroPluginConfig {
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
  schema?: string

  /**
   * GraphQL resolvers
   * @default 'graphql'
   */
  documents?: string

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
    }
  }
}

export interface ResolvedGraphQLNitroPluginConfig extends GraphQLNitroPluginConfig {
  endpoint: string
  mergeSchemas: boolean
  schema: string
  documents: string
  yogaConfig: {
    health: string
    ready: string
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
    }
    client: {
      configFilePath: string
      onlyDevelopment: boolean
      extension: '.graphql' | '.gql'
    }
  }
}

export interface GraphQLYogaOptions<Context extends Record<string, any> = object> {
  config?: GraphQLConfig
  onSuccess?: (event: H3Event, result: { user: any, tokens: any }) => Promise<void> | void
  onError?: (event: H3Event, error: H3Error) => Promise<void> | void
  onBeforeOptions?: (options: GraphqlYogaHandleOptions) => Promise<void> | void
  onAfterOptions?: (serverInstance: YogaServerInstance<any, any>) => Promise<void> | void
  onBeforeContext?: (options: GraphqlYogaContextOptions<Context>) => Promise<void> | void
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
