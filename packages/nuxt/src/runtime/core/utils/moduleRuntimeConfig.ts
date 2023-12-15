import defu from 'defu'
import type { NuxtPergel } from '../types'
import { generateProjectName, runtimeConfigToEnv } from '.'

export function generateModuleRuntimeConfig<T>(
  nuxt: NuxtPergel,
  config: Record<string, any>,
  customName?: string,
) {
  const projectName = nuxt._pergel._module.projectName
  const moduleName = nuxt._pergel._module.moduleName

  const runtimeConfig = nuxt.options.runtimeConfig

  const name = generateProjectName(projectName, moduleName, customName)
  runtimeConfig[name] = defu(runtimeConfig[name as any] as any, {
    ...config,
  }) as T

  const { envs, keyEnvValue } = runtimeConfigToEnv(runtimeConfig[name as any] as any, [name])

  nuxt._pergel.readmeYaml[projectName][moduleName] = defu(nuxt._pergel.readmeYaml[projectName][moduleName], {
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
