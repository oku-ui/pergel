import type { ClientOptions, SSRExchangeParams } from '@urql/core'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

/**
 * serializable URQL client options
 * @see {@link ClientOptions}
 */
export type ModuleClientOptions = Pick<ClientOptions, 'preferGetMethod' | 'requestPolicy' | 'maskTypename'>

/**
 * SSR exchange params
 * @see {@link SSRExchangeParams}
 */
export type ModuleSSRParams = Pick<SSRExchangeParams, 'staleWhileRevalidate' | 'includeExtensions'> & {
  /**
   * payload key for SSR data transmission
   */
  key: string

  /**
   * server side graphql endpoint URL, defaults to module endpoint
   */
  endpoint?: string
}

export interface UrqlModuleOptions extends PergelModuleOptions {
  /**
   * graphql endpoint URL
   * @see {@link ClientOptions.url}
   */
  endpoint?: string

  /**
   * client options object or path to client setup script
   */
  client?: ModuleClientOptions | 'custom'

  /**
   * SSR exchange options
   */
  ssr?: ModuleSSRParams

  /**
   * module driver
   * @default 'graphqlYoga'
   */
  driver?: 'graphqlYoga'
}

export interface ResolvedUrqlConfig extends ResolvedPergelModuleOptions {
  endpoint: string
  client: ModuleClientOptions | 'custom'
  ssr: ModuleSSRParams
  driver: 'graphqlYoga'
}

export interface UrqlModuleRuntimeConfig {
  endpoint: string
  client: ModuleClientOptions
  ssr: ModuleSSRParams
}
