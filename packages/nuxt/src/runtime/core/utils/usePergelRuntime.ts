import type { H3Event } from 'h3'
import { generateProjectName } from './generateProjectName'
import type { PergelGlobalContext } from '#pergel/types'
import { useRuntimeConfig } from '#imports'

export function usePergelRuntime<T>(data: PergelGlobalContext, _event?: H3Event) {
  // WATCH: https://github.com/nuxt/nuxt/issues/24095
  // TODO: add runtimeConfig `event` to `useRuntimeConfig`
  const runtimeConfig = useRuntimeConfig()
  const name = generateProjectName(
    data.projectName,
    data.moduleName,
  )

  const selectProject = runtimeConfig[name as any] as T
  return {
    selectProject,
  }
}
