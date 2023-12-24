import type { NuxtPergel, ResolvedModuleOptions } from '../types'

export function useModuleOptions<Options, ResolvedOptions>(
  nuxt: NuxtPergel,
  moduleOptions: ResolvedModuleOptions,
) {
  const { moduleName, projectName } = moduleOptions
  const resolvedOptions = (nuxt._pergel.projects[projectName as any] as any)[moduleName as any] as ResolvedOptions
  const rootOptions = (nuxt._pergel.rootOptions.projects[projectName as any] as any)[moduleName] as Options

  return {
    rootOptions,
    resolvedOptions,
  }
}
