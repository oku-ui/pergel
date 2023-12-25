import type { WebSocketServer } from 'vite'
import type { ModuleName, Modules, NuxtPergel, PergelOptions, ResolvedPergelOptions } from './module'

export interface ServerFunctions {
  getOptions(): ResolvedPergelOptions
  getProjects(): ResolvedPergelOptions['projects']
  getTotalModules(): ResolvedPergelOptions['modules']
  getProject(name: string): Modules
  getProjectModules(name: string): string[]
  getModuleOptions({ projectName, moduleName }: { projectName: string, moduleName: ModuleName }): Modules
  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: NuxtPergel
  options: PergelOptions
  wsServer: Promise<WebSocketServer>
}
