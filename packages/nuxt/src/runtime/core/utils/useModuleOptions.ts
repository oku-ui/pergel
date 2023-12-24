import type { ModuleName, NuxtPergel } from '../types'

export function useModuleOptions<Options, ResolvedOptions>(
  nuxt: NuxtPergel,
  moduleName: ModuleName,
) {
  const resolvedOptions = nuxt._pergel.projects[nuxt._pergel._module.projectName][moduleName] as ResolvedOptions
  const rootOptions = nuxt._pergel.rootOptions.projects[nuxt._pergel._module.projectName][moduleName] as Options

  return {
    rootOptions,
    resolvedOptions,
  }
}
