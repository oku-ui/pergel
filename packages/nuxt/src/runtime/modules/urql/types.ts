import type { PergelModuleOptions } from '../../core/types/module'

export interface UrqlModuleOptions extends PergelModuleOptions {
}

export interface UrqlModuleRuntimeConfig {
  endpoint: string
}
