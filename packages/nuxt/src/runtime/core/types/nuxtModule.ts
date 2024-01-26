import type { ImportsOptions, Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { UnimportPluginOptions } from 'unimport/unplugin'
import type { GraphQLYogaConfig, ResolvedGraphQLYogaConfig } from '../../modules/graphqlYoga/types'
import type { DrizzleConfig, ResolvedDrizzleConfig } from '../../modules/drizzle/types'
import type { LuciaModuleOptions } from '../../modules/lucia/types'
import type { BoxOptions, ResolvedBoxOptions } from '../../modules/box/types'

import type { ComposeSpecification } from '../../../moduleTypes/compose-spec-type'
import type { IonicInterface, ResolvedIonicInterface } from '../../modules/ionic/types'
import type { UserModuleOptions } from './module'

// @MODULE
export interface PergelNuxtModules {
  S3?: true | UserModuleOptions
  ses?: true | UserModuleOptions
  nodeCron?: true | UserModuleOptions
  bullmq?: true | UserModuleOptions
  json2csv?: true | UserModuleOptions
  graphqlYoga?: true | (GraphQLYogaConfig & UserModuleOptions)
  drizzle?: true | (DrizzleConfig & UserModuleOptions)
  lucia?: true | (LuciaModuleOptions & UserModuleOptions)
  box?: true | (BoxOptions & UserModuleOptions)
  ionic?: true | IonicInterface
}

export interface ResolvedPergelNuxtModuleConfig {
  S3?: true
  ses?: true
  nodeCron?: true
  bullmq?: true
  json2csv?: true
  graphqlYoga?: ResolvedGraphQLYogaConfig
  drizzle?: ResolvedDrizzleConfig
  box?: true | ResolvedBoxOptions
  ionic?: true | ResolvedIonicInterface
}

export type PergelModuleNames = keyof PergelNuxtModules

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
    [project: string]: PergelNuxtModules
  }

  /**
   * @default true
   */
  esnext?: boolean

  /**
   * @default false
   */
  debug?: true

  /**
   * @default 'server/pergel'
   */
  pergelServerDir?: string

  /**
   * @default 'pergel'
   */
  pergelDir?: string
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

  readmeJson: Record<string, any>

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
    [project: string]: ResolvedPergelNuxtModuleConfig & {
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

  serverDir: string

  watchDirs: {
    serverDir: string
    rootModuleDir: string
    projectName: string
    moduleName: string
  }[]

  resolveModules: {
    name: PergelModuleNames
    path: string
  }[]
}

export interface NuxtPergel extends Nuxt {
  _pergel: ResolvedPergelOptions
}

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
