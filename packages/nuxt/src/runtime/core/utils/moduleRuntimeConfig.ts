import defu from 'defu'
import { snakeCase } from 'scule'
import type { NuxtPergel } from '../types/nuxtModule'
import type { ResolvedPergelModuleOptions } from '../types/module'
import { generateProjectName } from './generateProjectName'
import { runtimeConfigToEnv } from './runtimeConfigToEnv'

export function generateModuleRuntimeConfig<T>(
  nuxt: NuxtPergel,
  moduleOptions: ResolvedPergelModuleOptions,
  config: Record<string, any> | {
    [key: string]: any
    default?: Record<string, any>
  },
  publicRuntime?: boolean,
  generateEnv?: boolean,
) {
  const defaultConfig = Object.assign({}, config.default)
  delete config.default

  const projectName = moduleOptions.projectName
  const moduleName = moduleOptions.moduleName

  const runtimeConfig = nuxt.options.runtimeConfig

  const name = generateProjectName(projectName, moduleName)

  if (publicRuntime) {
    runtimeConfig.public[projectName] ??= {}
    runtimeConfig.public[projectName] = defu(runtimeConfig.public[projectName] as any, {
      [moduleName]: {
        ...Object.entries(config).map(([key, value]) => {
          return {
            [key]: value === undefined
              ? process.env[`NUXT_${snakeCase(`${projectName}_${moduleName}_${key}` as string).toUpperCase()}`]
              : value,
          }
        }).reduce((acc, cur) => {
          return {
            ...acc,
            ...cur,
          }
        }, {}),
      },
    }) as T

    const { keyEnvValue } = runtimeConfigToEnv(
      (runtimeConfig.public as any)[projectName][moduleName] as any,
      [projectName, moduleName],
    )

    if (generateEnv === true) {
      nuxt._pergel.readmeJson[projectName] ??= {}
      nuxt._pergel.readmeJson[projectName][moduleName] ??= {} as any
      nuxt._pergel.readmeJson[projectName][moduleName] = defu(nuxt._pergel.readmeJson[projectName][moduleName], {
        env: {
          ...Object.entries(config).map(([key, __value]) => {
            const _key = `NUXT_${snakeCase(`${projectName}_${moduleName}_${key}` as string).toUpperCase()}`
            return {
              [_key]: defaultConfig[key] ?? '',
            }
          }).reduce((acc, cur) => {
            return {
              ...acc,
              ...cur,
            }
          }, {}),
        },
      })
    }

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

    nuxt._pergel.readmeJson[projectName] ??= {}
    nuxt._pergel.readmeJson[projectName][moduleName] ??= {} as any
    nuxt._pergel.readmeJson[projectName][moduleName] = defu(nuxt._pergel.readmeJson[projectName][moduleName], {
      env: {
        ...envs,
      },
    })

    return {
      env: keyEnvValue,
    }
  }
}
