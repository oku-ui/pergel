/**
 * @credit
 * https://github.com/nuxt/nuxt/blob/main/packages/schema/src/types/module.ts
 */

import type { ImportsOptions, Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'

import type { UnimportPluginOptions } from 'unimport/unplugin'
import type { GraphQLConfig } from '../../modules/graphqlYoga/types'

export interface Modules {
  S3?: true
  ses?: true
  nodeCron?: true
  bullmq?: true
  json2csv?: true
  graphqlYoga?: true | GraphQLConfig
}

export type ModuleName = keyof Modules | string

export interface PergelOptions {
  /**
   * @default {}
   * @example
   * {
   *  project1: {
   *    S3: true,
   *  },
   *  project2: {
   *    S3: true,
   *  },
   * }
   */
  projects: {
    [project: string]: Modules
  }
  /**
   * The root folder of the pergel folder.
   * @default 'pergel'
   * @example '/users/productdevbook/nuxt3/pergel'
   */
  pergelDir?: string

  /**
   * The root folder of the application.
   * Defaults to the path where `nuxt.options.rootDir` is located.
   * @default '/'
   * @example '/playground'
   */
  rootDir?: string
  /**
   * @default true
   */
  esnext?: boolean
}

export interface ResolvedPergelOptions<T extends ModuleOptions = ModuleOptions> extends PergelOptions {
  /**
   * Pergel user defined options.
   */
  options: Required<PergelOptions>
  /**
   * [S3, nodecron, graphql, drizzle]
   */
  modules: string[]

  /**
   * @example
   * ['project1', 'project2']
   */
  projectNames: string[]

  nitroImports: Partial<UnimportPluginOptions>
  nuxtImports: Partial<ImportsOptions>
  readmeYaml: Record<string, any>
  resolver: Resolver
  devServerHandler: {
    id: string
    fn: () => void
  }[]
  dts: {
    projectName: string
    body: string
    template: string
    moduleName: string
  }[]
  activeModules: string[]

  projects: {
    [project: string]: {
      [key in ModuleName]: {
        options: T

        /**
         * @example
         * 'Project1S3' | 'Project1NodeCron' | 'Project1GraphQL' | 'Project1Drizzle'
         */
        typeName: string

        /**
         * @example
         * 'users/productdevbook/nuxt3/pergel/${projectName}'
         */
        projectDir: string
        /**
         * @example
         * 'users/productdevbook/nuxt3/pergel/${projectName}/${moduleName}'
         */
        moduleDir: string

        dir: {

          /**
           * @example
           * 'pergel/${projectName}'
           */
          project: string

          /**
           * @example
           * 'pergel/${projectName}/${moduleName}'
           */
          module: string

          /**
           * @example
           * 'pergel'
           */
          root: string
        }

      }
    }
  }

  dir: {
    /**
     * @example
     * 'pergel'
     */
    pergel: string

    /**
     * @example
     * './'
     */
    root: string

    /**
     * @example
     * 'pergel/README.yml'
     */
    readme: string
  }

  _module: ResolvedPergelOptions<T>['projects'][string][ModuleName] & {
    projectName: string
    moduleName: string
  }

  contents: {
    projectName: string
    moduleName: string
    content: string | Promise<string>
    resolve: string | Promise<string>
  }[]

  /**
   * @example
   * '/users/productdevbook/nuxt3/pergel/README.yml'
   */
  readmeDir: string

  /**
   * @example
   * 'users/productdevbook/nuxt3'
   */
  rootDir: string

  /**
   * @example
   * 'users/productdevbook/nuxt3/pergel'
   */
  pergelDir: string
}

export interface NuxtPergel<T extends ModuleOptions = ModuleOptions> extends Nuxt {
  _pergel: ResolvedPergelOptions<T>
}

interface ModuleMeta {
  /** Module name. */
  name?: string
  /** Module version. */
  version?: string
  /**
   * The configuration key used within `nuxt.config` for this module's options.
   * For example, `@nuxtjs/axios` uses `axios`.
   */
  configKey?: string

  devDependencies?: Record<string, string>
  dependencies?: Record<string, string>
  dts?: boolean

  [key: string]: unknown
}

/** The options received.  */
export type ModuleOptions = Record<string, any>

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

export interface ModuleDefinition<T extends ModuleOptions = ModuleOptions> {
  meta?: ModuleMeta
  defaults?: T | ((data: { nuxt: NuxtPergel<T> }) => T)
  setup?: (
    this: void,
    data: { nuxt: NuxtPergel<T> }
  ) =>
  _ModuleSetupReturn
}

export interface PergelModule<T extends ModuleOptions = ModuleOptions> {
  (this: void, data: { nuxt: NuxtPergel<T> }): _ModuleSetupReturn
  getOptions?: (inlineOptions?: T, data?: { nuxt: NuxtPergel<T> }) => Promise<T>
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

export { }
