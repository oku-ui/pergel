import type { ModuleOptions } from './moduleType'

export interface ServerFunctions {
  getMyModuleOptions(): ModuleOptions
}

export interface ClientFunctions {
  showNotification(message: string): void
}
