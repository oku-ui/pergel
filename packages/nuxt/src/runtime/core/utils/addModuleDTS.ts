import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Nuxt } from '@nuxt/schema'
import { writeFilePergel } from './writeFilePergel'

export function addModuleDTS(data: {
  projectName: string
  moduleName: string
  interfaceNames: string[]
  nuxt: Nuxt
  dir: string
  pergelFolderTemplate?: string
  template?: string
}) {
  const typePath = join(data.dir, 'types.ts')
  const folderPath = join(data.dir)

  if (data.template) {
    data.nuxt._pergel.dts[data.projectName] ??= {}
    data.nuxt._pergel.dts[data.projectName][data.moduleName] ??= {
      interfaceNames: [],
      template: [],
    }
    data.nuxt._pergel.dts[data.projectName][data.moduleName].interfaceNames.push(...data.interfaceNames)
    data.nuxt._pergel.dts[data.projectName][data.moduleName].template.push(data.template)

    mkdirSync(folderPath, { recursive: true })

    const body = /* ts */`
declare module 'pergel/${data.projectName}/types' {
  ${data.template.replace('export ', '')}
}
      `.trim()

    if (!existsSync(typePath)) {
      writeFilePergel(
        typePath,
        body,
      )
    }
  }

  if (data.pergelFolderTemplate) {
    if (!existsSync(typePath)) {
      writeFilePergel(
        typePath,
        data.pergelFolderTemplate,
      )
    }
  }

  return {
    path: typePath,
  }
}
