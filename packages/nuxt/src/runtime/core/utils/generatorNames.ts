import { camelCase } from 'scule'

export function generatorFunctionName(projectName: string, text: string) {
  return camelCase(`${projectName}-${text}`)
}

export function generatorFolderName(projectName: string, moduleName: string) {
  return `${camelCase(moduleName)}-${camelCase(projectName)}`
}
