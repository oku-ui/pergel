import { camelCase } from 'scule'

export function generateProjectName(projectName: string, moduleName: string) {
  return camelCase(`${projectName}-${moduleName}`)
}
