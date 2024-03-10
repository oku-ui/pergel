import type { Options } from 'postgres'
import type { PergelModuleOptions, ResolvedPergelModuleOptions } from '../../core/types/module'

export interface DrizzleConfig extends PergelModuleOptions {

  /**
   * Postres.js database
   * @link https://github.com/porsager/postgres
   * @default 'postgresjs:pg'
   */
  driver?: 'postgresjs:pg'

  /**
   * Database schemas
   * @default '{moduleName}-{projectName}/schema'
   */
  schemaPath?: string

  /**
   * Database migrations
   * @default '{moduleName}-{projectName}/migrations'
   */
  migrationsPath?: string

  /**
   * Database seeds
   * @default '{moduleName}-{projectName}/seeds'
   */
  seedPaths?: string

  autoImportPrefix?: {
    filters: string
  }

  /**
   * Database seeds
   * @default true
   */
  studio?: false

  watch?: {
    /**
     * Database push changes
     * @default true 'pergel module -s=push -p={projectName} -m={moduleName}'
     */
    push?: false

    /**
     * Database seeds
     * @default true 'pergel module -s=dev:seed -p={projectName} -m={moduleName}'
     */
    seed?: false

    /**
     * Database Drop
     * @default true 'pergel module -s=dev:drop -p={projectName} -m={moduleName}'
     */
    drop?: false
  }
}

export interface ResolvedDrizzleConfig extends ResolvedPergelModuleOptions {

  driver: 'postgresjs:pg'

  _driver: {
    /**
     * Postres.js database
     * @default 'postgresjs'
     */
    name: 'postgresjs'
    /**
     * Postres.js database
     * @default 'pg'
     */
    driver: 'pg'
  }

  /**
   * Database schemas
   * @default '{moduleName}-{projectName}/schema'
   */
  schemaPath: string

  /**
   * Database migrations
   * @default '{moduleName}-{projectName}/migrations'
   */
  migrationsPath: string

  /**
   * Database seeds
   * @default '{moduleName}-{projectName}/seeds'
   */
  seedPaths: string

  dir: {
    /**
     * Database schemas
     * @default 'schema'
     */
    schema: string
    /**
     * Database migrations
     * @default 'migrations'
     */
    migrations: string

    /**
     * Database seeds
     * @default 'seeds'
     */
    seeds: string
  }

  autoImportPrefix?: {
    filters: string
  }

  studio: boolean

  watch: {
    /**
     * Database push changes
     * @default true 'pergel module -s=push -p={projectName} -m={moduleName}'
     */
    push: false

    /**
     * Database seeds
     * @default true 'pergel module -s=seed -p={projectName} -m={moduleName}'
     */
    seed: false

    /**
     * Database Drop
     * @default true 'pergel module -s=drop -p={projectName} -m={moduleName}'
     */
    drop: false
  }
}

export interface PostgresJSOptions {
  /**
   */
  url?: string
  /**
   * @default {} postgres options
   */
  // TODO: refactor any type
  options?: Options<any>
}

export interface PostgresJSModuleRuntimeConfig {
  url?: string
  options?: Options<any>
}

export interface DrizzleRuntimeConfig {
  drop: boolean
  push: boolean
  seed: boolean
  migrate: boolean
  mode: string
}
