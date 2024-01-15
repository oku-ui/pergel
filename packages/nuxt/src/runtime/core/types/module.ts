/**
 * @credit
 * https://github.com/nuxt/nuxt/blob/main/packages/schema/src/types/module.ts
 */

import type { NuxtPergel, PergelModuleNames } from './nuxtModule'

export type { ResolvedGraphQLYogaConfig } from '../../modules/graphqlYoga/types'

export interface ResolvedPergelModuleOptions {
  /**
   * @default
   * 'test'
   */
  moduleName: string

  /**
   * @default
   * 'test'
   */

  projectName: string
  /**
   * @default
   * test -> Test
   */

  /**
   * @default
   * testHello -> pergelTestHello
   */
  projectNamePascalCase: string

  /**
   * @default
   *  /home/username/nuxt3/pergel/${moduleName}-${projectName}
   */
  rootModuleDir: string

  /**
   * @default
   * /home/username/nuxt3/pergel/server/${moduleName}-${projectName}
   */
  serverDir: string

  /**
   * ModuleDir
   */
  _dir: {
    /**
     * @default
     * '${moduleName}-${projectName}'
     */
    module: string

    /**
     * @default
     * 'server/${moduleName}-${projectName}'
     */
    server: string
  }

  [key: string]: any
}

interface ModuleMeta<T extends ResolvedPergelModuleOptions = ResolvedPergelModuleOptions> {
  /** Module name. */
  name?: string
  /** Module version. */
  version?: string
  /**
   * The configuration key used within `nuxt.config` for this module's options.
   * For example, `@nuxtjs/axios` uses `axios`.
   */
  configKey?: string

  devDependencies?: Record<string, string> | ((options: T) => Record<string, string>)
  dependencies?: Record<string, string> | ((options: T) => Record<string, string>)
  dts?: boolean

  waitModule?: PergelModuleNames[] | ((options: T) => PergelModuleNames[] | undefined)
  rootModuleDir?: string

  [key: string]: any
}

/** The options received.  */
export type PergelModuleOptions = Record<string, any>

/** Optional result for nuxt modules */
export interface ModuleSetupReturn {
  /**
   * Timing information for the initial setup
   */
  timings?: {
    /** Total time took for module setup in ms */
    setup?: number
    [key: string]: number | undefined
  }
}

export type Awaitable<T> = T | Promise<T>
type _ModuleSetupReturn = Awaitable<void | false | ModuleSetupReturn>

export interface ModuleDefinition<T extends PergelModuleOptions = PergelModuleOptions, ResolvedOptions extends PergelModuleOptions = PergelModuleOptions> {
  meta?: ModuleMeta<ResolvedPergelModuleOptions>
  defaults?: ResolvedOptions
  | ((data: {
    nuxt: NuxtPergel
    options: ResolvedOptions & ResolvedPergelModuleOptions
    rootOptions: T
  })
  => ResolvedOptions & ResolvedPergelModuleOptions)
  setup?: (
    this: void,
    data: {
      nuxt: NuxtPergel
      options: ResolvedOptions & ResolvedPergelModuleOptions
      rootOptions: T
    },
  ) =>
  _ModuleSetupReturn
}

export interface PergelModule<RootOptions extends PergelModuleOptions = PergelModuleOptions, ResolvedOptions extends PergelModuleOptions = PergelModuleOptions> {
  (this: void, data: {
    nuxt: NuxtPergel
    options: ResolvedOptions & ResolvedPergelModuleOptions
    rootOptions: RootOptions
  }): _ModuleSetupReturn
  getOptions?: (
    inlineOptions?: ResolvedOptions,
    data?: {
      nuxt: NuxtPergel
      options: ResolvedOptions & ResolvedPergelModuleOptions
    }) => Promise<ResolvedOptions & ResolvedPergelModuleOptions>
  getMeta?: () => ModuleMeta
}

export interface ModuleDefaults {
  [module: string]: any
}

export interface ModuleIndex {
  index: {
    name: string
    path: string
  }[]
}

export type Env = string | number | undefined
export type EnvList = Record<string, Env>

export interface GenerateReadmeYamlOpts {
  envs: Record<string, Record<string, EnvList>>
  projectNames: string[]
}

export type PartinalKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MaybePromise<T> = T | Promise<T>
