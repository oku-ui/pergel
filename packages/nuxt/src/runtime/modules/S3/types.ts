import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface S3ModuleOptions extends PergelModuleOptions {

}

export interface S3ModuleRuntimeConfig extends ResolvedPergelModuleOptions {
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}
