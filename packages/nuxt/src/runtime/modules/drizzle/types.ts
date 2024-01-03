import type { Options } from 'postgres'

export interface DrizzleConfig {

  /**
   * Postres.js database
   * @link https://github.com/porsager/postgres
   * @default 'postgresjs:pg'
   */
  driver?: 'postgresjs:pg'

  /**
   * Database schemas
   * @default 'pergel/{projectName}/{moduleName}/schema'
   */
  schemaPath?: string

  /**
   * Database migrations
   * @default 'pergel/{projectName}/{moduleName}/migrations'
   */
  migrationsPath?: string

  /**
   * Database seeds
   * @default 'pergel/{projectName}/{moduleName}/seeds'
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

export interface ResolvedDrizzleConfig {

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
   * @default 'home/user/project1/pergel/{projectName}/{moduleName}/schema'
   */
  schemaPath: string

  /**
   * Database migrations
   * @default 'home/user/project1/pergel/{projectName}/{moduleName}/migrations'
   */
  migrationsPath: string

  /**
   * Merge schemas
   * @default true
   */
  mergeSchemas?: boolean

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
  }

  /**
   * Database seeds
   * @default 'pergel/{projectName}/{moduleName}/seeds'
   */
  seedPaths: string

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

  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  ssl?: boolean
  drop?: boolean
  seed?: boolean
  dev?: boolean

  // TODO: refactor any type
  options?: Options<any>

}
