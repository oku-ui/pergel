import type { WebSocketServer } from 'vite'
import type { PergelModule } from './module'
import type { NuxtPergel, PergelModuleNames, PergelNuxtModules, PergelOptions, ResolvedPergelOptions } from './nuxtModule'

export interface ServerFunctions {
  getOptions(): ResolvedPergelOptions
  getProjects(): ResolvedPergelOptions['projects']
  getTotalModules(): ResolvedPergelOptions['modules']
  getProject(name: string): PergelModule
  getProjectModules(name: string): string[]
  getModuleOptions({ projectName, moduleName }: { projectName: string, moduleName: PergelModuleNames }): PergelNuxtModules
  reset(): void
}

export interface ClientFunctions {
}

export interface DevtoolsServerContext {
  nuxt: NuxtPergel
  options: PergelOptions
  wsServer: Promise<WebSocketServer>
}
