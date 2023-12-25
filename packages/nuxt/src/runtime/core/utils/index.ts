import { snakeCase } from 'scule'
import type { EnvList } from '../types'
export { useModuleOptions } from './useModuleOptions'
/**
 * Reformat source code for improved readability by adding appropriate newlines and indentation.
 */
export function reformatSourceCode(sourceCode: string): string {
  const lines = sourceCode.split('\n')
  let indentLevel = 0
  let result = ''

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    const lastLine = lines[index - 1]?.trim()

    if (!trimmedLine)
      return

    if (trimmedLine.startsWith('return') && !lastLine?.endsWith('{'))
      result += '\n'

    if (trimmedLine.startsWith('function'))
      result += '\n'

    if (trimmedLine.startsWith('//') || trimmedLine === '') {
      result += `${trimmedLine}\n`
      return
    }

    if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']'))
      indentLevel--

    result += `${'  '.repeat(Math.max(indentLevel, 0))}${trimmedLine}\n`

    if (trimmedLine.endsWith('{') || trimmedLine.endsWith('['))
      indentLevel++
  })

  return result
}

/**
 * Capitalize the first letter of a string
 */
export function firstLetterUppercase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function generateProjectName(projectName: string, moduleName: string, customName?: string) {
  return customName ? `${projectName + firstLetterUppercase(moduleName) + firstLetterUppercase(customName)}` : `${projectName + firstLetterUppercase(moduleName)}`
}

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
