import type { Nuxt } from 'nuxt/schema'
import type { WebSocketServer } from 'vite'
import type { PergelOptions } from './module'

export interface ServerFunctions {
  getOptions(): PergelOptions

  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: Nuxt
  options: PergelOptions
  wsServer: Promise<WebSocketServer>
}
