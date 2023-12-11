import type { Nuxt } from 'nuxt/schema'
import type { WebSocketServer } from 'vite'
import type { Modules, PergelOptions } from './module'

export interface ServerFunctions {
  getOptions(): PergelOptions
  getProjects(): string[]
  getProject(name: string): Modules
  getProjectModules(name: string): string[]
  getProjectModule(name: string): Modules[keyof Modules]

  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: Nuxt
  options: PergelOptions
  wsServer: Promise<WebSocketServer>
}
