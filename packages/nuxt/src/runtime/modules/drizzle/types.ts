import type { Options } from 'postgres'
import type { ResolvedPergelOptions } from '../../core/types'

export type DrizzleModuleOptions = ResolvedPergelOptions<ResolvedDrizzleConfig>

export interface DrizzleConfig {

  /**
   * Postres.js database
   * @link https://github.com/porsager/postgres
   * @default 'postgresjs'
   */
  driver?: 'postgresjs'

  /**
   * Database schemas
   * @default 'server/database/schema'
   */
  schemaPaths?: string

  /**
   * Database migrations
   * @default 'server/database/migrations'
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
   * @default 'pergel/{activeBranch}/{projectName}/schema'
   */
  schemaPaths: string

  /**
   * Database migrations
   * @default 'pergel/{activeBranch}/{projectName}/migrations'
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
   * @default process.env.POSTGRES_URL
   */
  url?: string
  /**
   * @default {} postgres options
   */
  // TODO: refactor any type
  options?: Options<any>
}
