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

  /**
   * @see https://github.com/pilcrowOnPaper/arctic
   * @see https://arctic.js.org/providers/github
   * @description The arctic instance to use for the lucia instance.
   * @default 'github'
   */
  oauth?: (
    'github'
    | 'google'
    | 'twitter'
    | 'gitlab'
  )[]
}

export interface ResolvedLuciaModuleOptions extends ResolvedPergelModuleOptions {
  driver: 'drizzle:postgre'

  oauth: (
    'github'
    | 'google'
    | 'twitter'
    | 'gitlab'
  )[]
}

export interface LuciaRuntimeConfig {
  github?: {
    clientId: string
    clientSecret: string
  }
  google?: {
    clientId: string
    clientSecret: string
    redirectURI: string
  }
  twitter?: {
    clientId: string
    clientSecret: string
    redirectURI: string
  }
  gitlab?: {
    clientId: string
    clientSecret: string
    redirectURI: string
  }
}
