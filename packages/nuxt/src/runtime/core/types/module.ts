/**
 * @credit
 * https://github.com/nuxt/nuxt/blob/main/packages/schema/src/types/module.ts
 */

import type { ImportsOptions, Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'

import type { UnimportPluginOptions } from 'unimport/unplugin'
import type { GraphQLYogaConfig, ResolvedGraphQLYogaConfig } from '../../modules/graphqlYoga/types'
import type { DrizzleConfig, ResolvedDrizzleConfig } from '../../modules/drizzle/types'
import type { LuciaModuleOptions } from '../../modules/lucia/types'
import type { ResolvedUIOptions } from '../../modules/ui/types'
import type { ComposeSpecification } from '../../../moduleTypes/compose-spec-type'

export type { ResolvedGraphQLYogaConfig } from '../../modules/graphqlYoga/types'

export interface Modules {
  S3?: true | ModuleOptions
  ses?: true | ModuleOptions
  nodeCron?: true | ModuleOptions
  bullmq?: true | ModuleOptions
  json2csv?: true | ModuleOptions
  graphqlYoga?: true | (GraphQLYogaConfig & ModuleOptions)
  drizzle?: true | (DrizzleConfig & ModuleOptions)
  lucia?: true | (LuciaModuleOptions & ModuleOptions)
  ui?: true | (ResolvedUIOptions & ModuleOptions)
}

export interface ResolvedModules {
  S3?: true
  ses?: true
  nodeCron?: true
  bullmq?: true
  json2csv?: true
  graphqlYoga?: ResolvedGraphQLYogaConfig
  drizzle?: ResolvedDrizzleConfig
  ui?: true | ResolvedUIOptions
}

export type ModuleName = keyof Modules

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
   * @default true
   */
  esnext?: boolean

  /**
   * @default false
   */
  debug?: true

  workspaceMode?: boolean
}

export interface ResolvedPergelOptions {
  exitPergelFolder: boolean
  /**
   * Pergel user defined options.
   */
  rootOptions: PergelOptions

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
    [projectName: string]: {
      [moduleName: string]: {
        interfaceNames: string[]
        template: string[]
        declareModules?: string
      }
    }
  }

  projects: {
    [project: string]: ResolvedModules & {
      /**
       * @example
       * 'users/productdevbook/nuxt3/pergel/${projectName}'
       */
      projectDir?: string
      /**
       * @example
       * 'users/productdevbook/nuxt3/pergel/${projectName}/${moduleName}'
       */
      moduleDir?: string

      dir: {

        /**
         * @example
         * '${projectName}'
         */
        project: string

        /**
         * @example
         * '${projectName}/${moduleName}'
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

  dir: {
    /**
     * @example
     * 'pergel'
     */
    pergel: string

    /**
     * @example
     * 'pergel/README.yml'
     */
    readme: string

    /**
     * @example
     * 'server'
     */
    server: string
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
  readmeDir?: string

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

  /**
   * @example
   * 'users/productdevbook/nuxt3/pergel/templates'
   */
  templateDir: string

  esnext: boolean

  debug: boolean

  templates?: {
    [name: string]: DefineDownloadOptions
  }

  composeTemplates?: {
    [projectName: string]: ComposeSpecification
  }

  workspaceMode: boolean

  serverDir: string
}

export interface NuxtPergel extends Nuxt {
  _pergel: ResolvedPergelOptions
}

export interface ResolvedModuleOptions {
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

interface ModuleMeta<T extends ResolvedModuleOptions = ResolvedModuleOptions> {
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

  waitModule?: ModuleName[] | ((options: T) => ModuleName[] | undefined)
  rootModuleDir?: string

  [key: string]: any
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

export interface ModuleDefinition<RootOptions extends ModuleOptions = ModuleOptions, ResolvedOptions extends ModuleOptions = ModuleOptions> {
  meta?: ModuleMeta<ResolvedModuleOptions>
  defaults?: ResolvedOptions
  | ((data: {
    nuxt: NuxtPergel
    options: ResolvedOptions & ResolvedModuleOptions
    rootOptions: RootOptions
  })
  => ResolvedOptions & ResolvedModuleOptions)
  setup?: (
    this: void,
    data: {
      nuxt: NuxtPergel
      options: ResolvedOptions & ResolvedModuleOptions
      rootOptions: RootOptions
    },
  ) =>
  _ModuleSetupReturn
}

export interface PergelModule<RootOptions extends ModuleOptions = ModuleOptions, ResolvedOptions extends ModuleOptions = ModuleOptions> {
  (this: void, data: {
    nuxt: NuxtPergel
    options: ResolvedOptions & ResolvedModuleOptions
    rootOptions: RootOptions
  }): _ModuleSetupReturn
  getOptions?: (
    inlineOptions?: ResolvedOptions,
    data?: {
      nuxt: NuxtPergel
      options: ResolvedOptions & ResolvedModuleOptions
    }) => Promise<ResolvedOptions & ResolvedModuleOptions>
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

export interface DefineDownloadOptions {
  version?: string
  branch?: string
  /**
   * Folder name
   * @default
   * `.tempPergel`
   */
  tempOutput?: string
  file?: {
    /**
     * Directory of file
     * @example
     * `packages/nuxt`
     */
    dir: string
    /**
     * File name
     * @example
     * [{
     * fileName: 'pergel.config.ts',
     * outputFileName: 'pergel.config.ts',
     * forceClean: false
     * }]
     */
    path: {
      /**
       * File name
       * @example
       * `pergel.config.ts`
       */
      fileName: string
      /**
       * Output file name
       * @example
       * `pergel.config.ts`
       */
      outputFileName: string

      /**
       * Force download
       * @default
       * `true`
       */
      forceClean?: boolean
    }[]
  }
  folder?: {
    /**
     * Directory of file
     * @example
     * `templates/default`
     */
    dir: string

    /**
     * Output file name
     * @example
     * `templates/default`
     */
    output: string

    /**
     * Force download
     * @default
     * `true`
     */
    forceClean: boolean
  }[]
}
