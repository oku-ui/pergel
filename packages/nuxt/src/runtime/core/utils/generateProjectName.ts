import { firstLetterUppercase } from './utils'

export function generateProjectName(projectName: string, moduleName: string, customName?: string) {
  return customName ? `${projectName + firstLetterUppercase(moduleName) + firstLetterUppercase(customName)}` : `${projectName + firstLetterUppercase(moduleName)}`
}
