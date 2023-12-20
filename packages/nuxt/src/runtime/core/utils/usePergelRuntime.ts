import type { H3Event } from 'h3'
import { generateProjectName } from '.'
import type { PergelGlobalContext } from '#pergel/types'
import { useRuntimeConfig } from '#imports'

export function usePergelRuntime<T>(data: PergelGlobalContext, event?: H3Event, customName?: string) {
  // WATCH: https://github.com/nuxt/nuxt/issues/24095
  // @ts-expect-error
  const runtimeConfig = useRuntimeConfig(event)
  const name = generateProjectName(
    data.projectName,
    data.moduleName,
    customName,
  )

  const selectProject = runtimeConfig[name as any] as T
  return {
    selectProject,
  }
}
