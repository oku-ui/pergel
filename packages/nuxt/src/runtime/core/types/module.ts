/**
 * @credit
 * https://github.com/nuxt/nuxt/blob/main/packages/schema/src/types/module.ts
 */

import type { Nuxt } from '@nuxt/schema'

export interface Modules {
  S3?: true
  ses?: true
  nodeCron?: true
  bullmq?: true
  json2csv?: true
}

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

export interface ResolvedPergelOptions<T extends ModuleOptions = ModuleOptions> {
  /**
   * Pergel user defined options.
   */
  rootOptions: Required<PergelOptions>

  /**
   * Root Options resolved from `rootOptions`.
   */
  resolvedOptions: {

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

    templateDir: {
      /**
       * @example
       * './'
       */
      root: string
    }

    resolveDir: {

      /**
       * @example
       * '/users/productdevbook/nuxt3/pergel/README.yml'
       */
      readmeDir: string

      /**
       * @example
       * 'users/productdevbook/nuxt3'
       */
      root: string

      /**
       * @example
       * 'users/productdevbook/nuxt3/pergel'
       */
      pergelRoot: string
    }

    /**
     * @example
     * ['project1', 'project2']
     */
    projectNames: string[]

  }

  resolvedModule: {
    /**
     * @example
     * 'S3' | 'nodecron' | 'graphQL' | 'drizzle'
     */
    name: string

    /**
     * End user defined module options.
     * @example
     * 'project1'
     */
    projectName: string

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
       * 'pergel/${activeBranch}/${projectName}'
       */
      project: string

      /**
       * @example
       * 'pergel/${activeBranch}/${projectName}/${moduleName}'
       */
      module: string
    }

    templateDir: {
      /**
       * @example
       * 'pergel'
       */
      root: string
      /**
       * @example
       * 'pergel/${projectName}/${moduleName}'
       */
      module: string

      /**
       * @example
       * 'pergel/${projectName}'
       */
      project: string
    }
  }

  _contents: {
    projectName: string
    moduleName: string
    content: string | Promise<string>
    resolve: string | Promise<string>
  }[]

  moduleOptions: T
}

export interface ResolvedProjectOptions {
  resolvedPergelOptions: ResolvedPergelOptions
  /**
   * @example
   * 'project1'
   */
  currentProject: {
    /**
     * @example
     * 'project1'
     */
    name: string

    dir: {
      /**
       * @example
       * 'pergel/dev/${projectname}'
       */
      project: string

      /**
       * @example
       * 'pergel/project1'
       */
      output: string

    }
    /**
     * @example
     * ['S3', 'nodecron', 'graphql', 'drizzle']
     */
    modules: Modules
  }
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
  defaults?: T | ((nuxt: Nuxt, resolvedOptions: ResolvedPergelOptions) => T)
  setup?: (
    this: void,
    resolvedOptions: ResolvedPergelOptions<T>,
    nuxt: Nuxt
  ) =>
  _ModuleSetupReturn
}

export interface PergelModule<T extends ModuleOptions = ModuleOptions> {
  (this: void, inlineOptions: ResolvedPergelOptions<T>, nuxt: Nuxt): _ModuleSetupReturn
  getOptions?: (inlineOptions?: T, nuxt?: Nuxt) => Promise<T>
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
