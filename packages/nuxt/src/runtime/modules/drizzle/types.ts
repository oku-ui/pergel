import type { Options } from 'postgres'
import type { ModuleOptions, ResolvedModuleOptions } from '../../core/types'

export interface DrizzleConfig extends ModuleOptions {

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

  /**
   * Merge schemas
   * @default true
   */
  mergeSchemas?: boolean

  autoImportPrefix?: {
    filters: string
  }

  /**
   * Database seeds
   * @default true
   */
  studio?: false

  dev?: {
    /**
     * Database seeds
     * @default 'pergel module -s=push -p={projectName} -m={moduleName}'
     */
    cli?: string | false
  }
}

export interface ResolvedDrizzleConfig extends ResolvedModuleOptions {

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
   * Merge schemas
   * @default true
   */
  mergeSchemas: boolean

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

  dev?: {
    /**
     * Database seeds
     * @default 'pergel module -s=push -p={projectName} -m={moduleName}'
     */
    cli: string | boolean
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
