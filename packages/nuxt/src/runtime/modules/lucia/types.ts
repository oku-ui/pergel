import type { Lucia } from 'lucia'
import type { ModuleOptions, ResolvedModuleOptions } from '../../core/types'

export type LuciaOptions = ConstructorParameters<typeof Lucia>['1']

export interface LuciaModuleOptions extends ModuleOptions {
  // TODO: more driver support
  /**
   * @default 'drizzle:postgre'
   * @description The driver to use for the lucia instance.
   */
  driver: 'drizzle:postgre'
}

export interface ResolvedLuciaModuleOptions extends ResolvedModuleOptions {
  driver: 'drizzle:postgre'
}
