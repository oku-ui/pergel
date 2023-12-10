import type { Nuxt } from 'nuxt/schema'
import type { WebSocketServer } from 'vite'
import type { ModuleOptions } from '../module'

export interface ServerFunctions {
  getOptions(): ModuleOptions

  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: Nuxt
  options: ModuleOptions
  wsServer: Promise<WebSocketServer>
}
