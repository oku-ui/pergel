import { join } from 'node:path'
import type { NuxtPergel } from '../runtime/core/types/nuxtModule'
import { writeFilePergel } from '../runtime/core/utils/writeFilePergel'

export function writeVSCode(
  nuxt: NuxtPergel,
) {
  const readme = Object.keys(nuxt._pergel.readmeJson).map((projectName) => {
    const project = nuxt._pergel.readmeJson[projectName]
    const modules = Object.keys(project).map((moduleName) => {
      const module = project[moduleName]
      const vscode = module.vscode
      return { moduleName, vscode }
    })
    return { projectName, modules }
  })

  let vsCodeObject = {}

  for (const project of readme) {
    const modules = project.modules
    for (const module of modules) {
      const vscode = module.vscode
      if (vscode) {
        vsCodeObject = {
          ...vsCodeObject,
          ...vscode,
        }
      }
    }
  }

  const file = join(nuxt.options.rootDir, 'pergel', '.vscode', 'settings.json')

  nuxt._pergel.exitPergelFolder && writeFilePergel(file, JSON.stringify(vsCodeObject, null, 2))
}
