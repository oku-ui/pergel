import type { Lucia } from 'lucia'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export type LuciaOptions = ConstructorParameters<typeof Lucia>['1']

export interface LuciaModuleOptions extends PergelModuleOptions {
  // TODO: more driver support
  /**
   * @default 'drizzle:postgre'
   * @description The driver to use for the lucia instance.
   */
  driver: 'drizzle:postgre'
}

export interface ResolvedLuciaModuleOptions extends ResolvedPergelModuleOptions {
  driver: 'drizzle:postgre'
}
