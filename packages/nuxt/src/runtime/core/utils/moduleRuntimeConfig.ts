import { join } from 'node:path'
import defu from 'defu'
import { addTemplate } from '@nuxt/kit'
import type { NuxtPergel } from '../types/nuxtModule'
import type { ResolvedPergelModuleOptions } from '../types/module'
import { generateProjectName, runtimeConfigToEnv } from '.'

export function generateModuleRuntimeConfig<T>(
  nuxt: NuxtPergel,
  moduleOptions: ResolvedPergelModuleOptions,
  config: Record<string, any>,
  publicRuntime?: boolean,
  customName?: string,
) {
  const projectName = moduleOptions.projectName
  const moduleName = moduleOptions.moduleName

  const runtimeConfig = nuxt.options.runtimeConfig

  const combinedName = join(projectName, moduleName)
  const name = generateProjectName(projectName, moduleName, customName)

  if (publicRuntime) {
    runtimeConfig.public[projectName] = defu(runtimeConfig.public[projectName] as any, {
      [moduleName]: {
        ...config,
      },
    }) as T

    const { envs, keyEnvValue } = runtimeConfigToEnv(runtimeConfig.public[projectName as any] as any, [projectName], false)

    addTemplate({
      filename: join('pergel', combinedName, 'runtimeConfig.ts'),
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
    nuxt._pergel.readmeYaml[projectName][moduleName] ??= {} as any
    nuxt._pergel.readmeYaml[projectName][moduleName] = defu(nuxt._pergel.readmeYaml[projectName][moduleName], {
      env: {
        ...envs,
      },
    })

    return {
      env: keyEnvValue,
    }
  }
}
