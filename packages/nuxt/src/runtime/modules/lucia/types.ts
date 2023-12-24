import type { Lucia } from 'lucia'

export type LuciaOptions = ConstructorParameters<typeof Lucia>['1']

export interface LuciaModuleOptions {
  // TODO: more driver support
  /**
   * @default 'drizzle:postgre'
   * @description The driver to use for the lucia instance.
   */
  driver: 'drizzle:postgre'
}

export interface ResolvedLuciaModuleOptions {
  rootOptions: LuciaModuleOptions

  driver: 'drizzle:postgre'
}
