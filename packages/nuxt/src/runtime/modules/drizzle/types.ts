import type { Options } from 'postgres'

export interface DrizzleConfig {

  /**
   * Postres.js database
   * @link https://github.com/porsager/postgres
   * @default 'postgresjs'
   */
  driver?: 'postgresjs'

  /**
   * Database schemas
   * @default 'pergel/{projectName}/{moduleName}/schema'
   */
  schemaPaths?: string

  /**
   * Database migrations
   * @default 'pergel/{projectName}/{moduleName}/migrations'
   */
  migrationsPaths?: string

  /**
   * Merge schemas
   * @default true
   */
  mergeSchemas?: boolean

  autoImportPrefix?: {
    filters: string
  }
}

export interface ResolvedDrizzleConfig {

  /**
   * Postres.js database
   * @link https://github.com/porsager/postgres
   * @default 'postgresjs'
   */
  driver: 'postgresjs'

  /**
   * Database schemas
   * @default 'pergel/{projectName}/{moduleName}/schema'
   */
  schemaPaths: string

  /**
   * Database migrations
   * @default 'pergel/{projectName}/{moduleName}/migrations'
   */
  migrationsPaths: string

  /**
   * Merge schemas
   * @default true
   */
  mergeSchemas?: boolean

  autoImportPrefix?: {
    filters: string
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
