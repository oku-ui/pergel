import { camelCase, pascalCase } from 'scule'

export function generatorFunctionName(projectName: string, text: string, options?: {
  type?: boolean
  pergel?: boolean
}) {
  options = {
    type: false,
    pergel: false,
    ...options,
  }

  if (!options.pergel)
    return options.type === false ? camelCase(`${projectName}-${text}`) : pascalCase(`${projectName}-${text}`)
  else
    return options.type === false ? camelCase(`pergel-${projectName}-${text}`) : pascalCase(`pergel-${projectName}-${text}`)
}

export function generatorFolderName(projectName: string, moduleName: string) {
  return `${camelCase(moduleName)}-${camelCase(projectName)}`
}
