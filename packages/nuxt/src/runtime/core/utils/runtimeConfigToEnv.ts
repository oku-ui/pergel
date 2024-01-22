import { snakeCase } from 'scule'
import type { EnvList } from '../types/module'

/**
 * Determines the environment variable prefix based on defined environment variables.
 */
function determineEnvPrefix(customPrefix?: string) {
  const defaultPrefix = 'NUXT_'
  const alternativePrefixVariable = 'NITRO_ENV_PREFIX'

  return customPrefix ?? process.env[alternativePrefixVariable] ?? defaultPrefix
}

/**
 * Converts a runtime configuration object into an environment variable list.
 * It returns an object mapping formatted environment variable names to their values.
 */
export function runtimeConfigToEnv<T extends string>(
  runtimeConfig: Record<string, any>,
  parentKey: string | string[] = '',
  customPrefix?: string | false,
) {
  const envs = {} as EnvList
  // { key: envKey }
  const keyEnvValue = {} as Record<T, string>
  const prefix = customPrefix === false ? '' : determineEnvPrefix(customPrefix)

  const _parentKey = Array.isArray(parentKey) ? parentKey.join('_') : parentKey

  for (const [key, value] of Object.entries(runtimeConfig)) {
    const fullKey = _parentKey ? `${_parentKey}_${key}` : key
    const envKey = prefix + snakeCase(fullKey).toUpperCase()

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If value is a nested object, recursively call the function
      Object.assign(envs, runtimeConfigToEnv(value, fullKey, customPrefix).envs)
      keyEnvValue[key as T] = keyEnvValue[fullKey as T] ?? envKey
    }
    else {
      envs[envKey] = value
      keyEnvValue[key as T] = envKey
    }
  }

  return {
    envs,
    keyEnvValue,
  }
}
