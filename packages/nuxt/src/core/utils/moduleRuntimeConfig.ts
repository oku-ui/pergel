import defu from 'defu'
import type { Nuxt } from '@nuxt/schema'
import type { ResolvedPergelOptions } from '../types'
import { generateProjectName, runtimeConfigToEnv } from '.'

export function generateModuleRuntimeConfig<T>(
  nuxt: Nuxt,
  options: ResolvedPergelOptions<any>,
  config: Record<string, any>,
  customName?: string,
) {
  const projectName = options.resolvedModule.projectName
  const moduleName = options.resolvedModule.name

  const runtimeConfig = nuxt.options.runtimeConfig

  const name = generateProjectName(projectName, moduleName, customName)
  runtimeConfig[name] = defu(runtimeConfig[name as any] as any, {
    ...config,
  }) as T

  const { envs, keyEnvValue } = runtimeConfigToEnv(runtimeConfig[name as any] as any, [name])

  nuxt._pergel.readmeYaml[projectName][options.resolvedModule.name] = defu(nuxt._pergel.readmeYaml[projectName][options.resolvedModule.name], {
    ...customName
      ? {
          [customName]: {
            env: {
              ...envs,
            },
          },
        }
      : {
          env: {
            ...envs,
          },
        },
  })

  return {
    env: keyEnvValue,
  }
}
