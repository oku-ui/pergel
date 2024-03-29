/**
 * @credit
 * https://github.com/nuxt/nuxt/blob/main/packages/schema/src/types/module.ts
 */

import type { NuxtPergel, PergelModuleNames } from './nuxtModule'

export type { ResolvedGraphQLYogaConfig } from '../../modules/graphqlYoga/types'

export interface UserModuleOptions {
  serverDir?: string
  rootModuleDir?: string
}

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
   * TestHello -> testHello
   */
  projectNameCamelCase: string

  /**
   * @default
   * projectname: test
   * moduleName: drizzle
   * = drizzle-test
   */
  folderName: string

  /**
   * @default
   * testHello -> pergelTestHello
   */
  projectNameCamelCaseWithPergel: string

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

  /** @default "/<rootDir>/.nuxt/pergel/${projectName}/${moduleName}" */
  buildDir: string

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

    /** @default '.nuxt/pergel/${projectName}/${moduleName}' */
    build: string
  }

  /**
   * @default
   * false
   */
  devtoolsStatus?: boolean
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

  devDependencies?: Record<string, string> | ((options: T, nuxt: NuxtPergel) => Record<string, string>)
  dependencies?: Record<string, string> | ((options: T, nuxt: NuxtPergel) => Record<string, string>)
  patches?: Record<string, any> | ((options: T, nuxt: NuxtPergel) => {
    pnpm?: {
      patchedDependencies: Record<string, string>
    }
  })
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

export interface ModuleDefinition<T extends PergelModuleOptions = PergelModuleOptions, ResolvedOptions = PergelModuleOptions> {
  meta?: ModuleMeta<ResolvedPergelModuleOptions & ResolvedOptions>
  defaults?: T
  | ((data: {
    nuxt: NuxtPergel
    options: ResolvedPergelModuleOptions & ResolvedOptions
    rootOptions: T
  })
  => ResolvedOptions & Partial<ResolvedPergelModuleOptions>)
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

export interface PergelModule<RootOptions extends PergelModuleOptions = PergelModuleOptions, ResolvedOptions = PergelModuleOptions> {
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
