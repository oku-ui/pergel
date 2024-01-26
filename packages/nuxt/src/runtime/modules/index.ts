import type {
  S3Client,
} from '@aws-sdk/client-s3'
import type { Redis } from 'ioredis'
import type { SESClient } from '@aws-sdk/client-ses'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export interface PergelH3ContextItem {
  s3?: {
    client?: S3Client
  }
  drizzle?: {
    postgressJSClient: PostgresJsDatabase
  }
  bullmq?: {
    client?: Redis
  }
  ses?: {
    client?: SESClient
  }
}
