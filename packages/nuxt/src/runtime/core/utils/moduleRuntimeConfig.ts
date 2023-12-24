import defu from 'defu'
import { addTemplate } from '@nuxt/kit'
import type { NuxtPergel, ResolvedModuleOptions } from '../types'
import { generateProjectName, runtimeConfigToEnv } from '.'

export function generateModuleRuntimeConfig<T>(
  nuxt: NuxtPergel,
  moduleOptions: ResolvedModuleOptions,
  config: Record<string, any>,
  publicRuntime?: boolean,
  customName?: string,
) {
  const projectName = moduleOptions.projectName
  const moduleName = moduleOptions.moduleName

  const runtimeConfig = nuxt.options.runtimeConfig

  const name = generateProjectName(projectName, moduleName, customName)

  if (publicRuntime) {
    runtimeConfig.public[projectName] = defu(runtimeConfig.public[projectName] as any, {
      [moduleName]: {
        ...config,
      },
    }) as T

    const { envs, keyEnvValue } = runtimeConfigToEnv(runtimeConfig.public[projectName as any] as any, [projectName], false)

    addTemplate({
      filename: `./pergel/${projectName}/${moduleName}/runtimeConfig.ts`,
      write: true,
      getContents: () => {
        return `export default ${JSON.stringify(envs as any, null, 2)}`
      },
    })
    return {
      runtimeConfig: (runtimeConfig.public[projectName] as any)[moduleName] as T,
      env: keyEnvValue,
    }
  }
  else {
    runtimeConfig[name] = defu(runtimeConfig[name as any] as any, {
      ...config,
    }) as T

    const { envs, keyEnvValue } = runtimeConfigToEnv(runtimeConfig[name as any] as any, [name])

    nuxt._pergel.readmeYaml[projectName] ??= {}
    nuxt._pergel.readmeYaml[projectName][moduleName] ??= {}
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
}
