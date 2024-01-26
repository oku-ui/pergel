import type { H3Event } from 'h3'
import { camelCase } from 'scule'
import type {
  S3Client,
} from '@aws-sdk/client-s3'
import type { Redis } from 'ioredis'
import type { SESClient } from '@aws-sdk/client-ses'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { S3ModuleRuntimeConfig } from '../../modules/S3/types'
import type { PostgresJSModuleRuntimeConfig } from '../../modules/drizzle/types'
import { usePergelRuntime } from '../../core/utils/usePergelRuntime'
import type { BullMQModuleRuntimeConfig } from '../../modules/bullmq/types'
import type { SesModuleRuntimeConfig } from '../../modules/ses/types'
import type { PergelGlobalContext } from '#pergel/types'

interface MapType {
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

interface RuntimeConfigType {
  s3?: S3ModuleRuntimeConfig
  drizzle?: PostgresJSModuleRuntimeConfig
  bullmq?: BullMQModuleRuntimeConfig
  ses?: SesModuleRuntimeConfig
}

type RuntimeConfigTypeKeys = keyof RuntimeConfigType

export async function usePergelState<T extends RuntimeConfigTypeKeys>(
  data: PergelGlobalContext,
  clientObject: (runtime: RuntimeConfigType[T]) => MapType,
  event: H3Event | false,
  additionalMapValues?: object,
) {
  const mergedProjectName = camelCase(`${data.moduleName}-${data.projectName}`)

  if (event) {
    let moduleData = event.context.globalModuleContext[mergedProjectName] as MapType
    const { selectProject } = usePergelRuntime<RuntimeConfigType[T]>({
      moduleName: data.moduleName,
      projectName: data.projectName,
    }, event)

    if (moduleData) {
      return {
        selectData: moduleData,
        runtime: selectProject,
      }
    }

    const returnData = clientObject(selectProject as RuntimeConfigType[T]) as MapType[T]
    if (!returnData)
      throw new Error(`${data.moduleName} is not defined`)

    moduleData ??= {} as MapType
    moduleData = returnData as MapType

    event.context.globalModuleContext[mergedProjectName] = {
      ...returnData as MapType,
      ...additionalMapValues,
    }

    return {
      selectData: moduleData,
      runtime: selectProject,
    }
  }
  else {
    const { selectProject } = usePergelRuntime<RuntimeConfigType[T]>({
      moduleName: data.moduleName,
      projectName: data.projectName,
    })

    const returnData = clientObject(selectProject as RuntimeConfigType[T]) as MapType[T]
    if (!returnData)
      throw new Error(`${data.moduleName} is not defined`)

    return {
      selectData: returnData as MapType,
      runtime: selectProject,
    }
  }
}
