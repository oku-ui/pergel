import type { H3Event } from 'h3'

import type { S3ModuleRuntimeConfig } from '../../modules/S3/types'
import type { PostgresJSModuleRuntimeConfig } from '../../modules/drizzle/types'
import { usePergelRuntime } from '../../core/utils/usePergelRuntime'
import type { BullMQModuleRuntimeConfig } from '../../modules/bullmq/types'
import type { SesModuleRuntimeConfig } from '../../modules/ses/types'
import type { PergelH3ContextItem } from '../../modules'
import type { PergelGlobalContext } from '#pergel/types'

interface RuntimeConfigType {
  s3?: S3ModuleRuntimeConfig
  drizzle?: PostgresJSModuleRuntimeConfig
  bullmq?: BullMQModuleRuntimeConfig
  ses?: SesModuleRuntimeConfig
}

type RuntimeConfigTypeKeys = keyof RuntimeConfigType

export async function usePergelContext<T extends RuntimeConfigTypeKeys>(
  data: PergelGlobalContext,
  clientObject: (runtime: RuntimeConfigType[T]) => PergelH3ContextItem,
  event: H3Event | false,
  additionalMapValues?: object,
) {
  if (event) {
    let moduleData = event.context.pergelContext[data.projectName] as PergelH3ContextItem
    const { selectProject } = usePergelRuntime<RuntimeConfigType[T]>({
      moduleName: data.moduleName,
      projectName: data.projectName,
    }, event)

    if (moduleData && (moduleData as any)[data.moduleName]) {
      return {
        selectData: moduleData,
        runtime: selectProject,
      }
    }

    const returnData = clientObject(selectProject as RuntimeConfigType[T]) as PergelH3ContextItem[T]
    if (!returnData)
      throw new Error(`${data.moduleName} is not defined`)

    moduleData ??= {} as PergelH3ContextItem
    moduleData = returnData as PergelH3ContextItem

    event.context.pergelContext[data.projectName] = {
      ...returnData as PergelH3ContextItem,
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

    const returnData = clientObject(selectProject as RuntimeConfigType[T]) as PergelH3ContextItem[T]
    if (!returnData)
      throw new Error(`${data.moduleName} is not defined`)

    return {
      selectData: returnData as PergelH3ContextItem,
      runtime: selectProject,
    }
  }
}
