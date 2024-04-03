import type { ClientOptions, SSRExchangeParams } from '@urql/core'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

/**
 * serializable URQL client options
 * @see {@link ClientOptions}
 */
export type ModuleClientOptions = Pick<ClientOptions, 'preferGetMethod' | 'requestPolicy'>

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
  devEndpoint: string

  /**
   * client side graphql endpoint URL, defaults to module endpoint
   */
  productionEndpoint: string
}

export interface UrqlModuleOptions extends PergelModuleOptions {
  /**
   * graphql endpoint URL
   * @see {@link ClientOptions.url}
   */
  endpoint?: string

  devEndpoint?: string

  /**
   * client options object or path to client setup script
   */
  client?: ModuleClientOptions | 'custom'

  /**
   * SSR exchange options
   */
  ssr?: ModuleSSRParams & {
    /**
     * server side graphql endpoint URL, defaults to module endpoint
     */
    devEndpoint?: string

    /**
     * client side graphql endpoint URL, defaults to module endpoint
     */
    productionEndpoint?: string
  }

  /**
   * module driver
   * @default 'graphqlYoga'
   */
  driver?: 'graphqlYoga'
}

export interface ResolvedUrqlConfig extends ResolvedPergelModuleOptions {
  devEndpoint: string
  productionEndpoint: string
  client: ModuleClientOptions | 'custom'
  ssr: ModuleSSRParams & {
    devEndpoint: string
    productionEndpoint: string
  }
  driver: 'graphqlYoga'
}

export interface UrqlModuleRuntimeConfig {
  productionEndpoint: string
  devEndpoint: string
  client: ModuleClientOptions | 'custom'
  ssr: ModuleSSRParams & {
    devEndpoint: string
    productionEndpoint: string
  }
}
