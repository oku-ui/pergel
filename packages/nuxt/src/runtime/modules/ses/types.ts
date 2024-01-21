import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface SesModuleOptions extends PergelModuleOptions {
}

export interface SesModuleRuntimeConfig extends ResolvedPergelModuleOptions {
  region: string
  accessKeyId: string
  secretAccessKey: string
}
