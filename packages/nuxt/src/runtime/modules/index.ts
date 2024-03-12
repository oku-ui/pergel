import type {
  S3Client,
} from '@aws-sdk/client-s3'
import type { Redis } from 'ioredis'
import type { SESClient } from '@aws-sdk/client-ses'
import type postgres from 'postgres'

export interface PergelH3ContextItem {
  s3?: {
    client?: S3Client
  }
  drizzle?: {
    postgressJSClient: postgres.Sql
  }
  bullmq?: {
    client?: Redis
  }
  ses?: {
    client?: SESClient
  }
}

export type PergelContextKeys = keyof PergelH3ContextItem
