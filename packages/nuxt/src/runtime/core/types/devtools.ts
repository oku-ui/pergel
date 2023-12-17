import type { WebSocketServer } from 'vite'
import type { Modules, NuxtPergel, PergelOptions, ResolvedPergelOptions } from './module'

export interface ServerFunctions {
  getOptions(): ResolvedPergelOptions
  getProjects(): ResolvedPergelOptions['projects']
  getTotalModules(): ResolvedPergelOptions['modules']
  getActiveModules(): ResolvedPergelOptions['activeModules']
  getProject(name: string): Modules
  getProjectModules(name: string): string[]
  getProjectModule(name: string): Modules[keyof Modules]
  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: NuxtPergel
  options: PergelOptions
  wsServer: Promise<WebSocketServer>
}
