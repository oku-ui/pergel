import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Nuxt } from '@nuxt/schema'

export function addModuleDTS(data: {
  template?: string
  projectName: string
  moduleName: string
  pergelFolderTemplate?: string
  interfaceNames: string[]
  nuxt: Nuxt
  dir: string
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
      writeFileSync(
        typePath,
        body,
      )
    }
  }

  if (data.pergelFolderTemplate) {
    if (!existsSync(typePath)) {
      writeFileSync(
        typePath,
        data.pergelFolderTemplate,
      )
    }
  }

  return {
    path: typePath,
  }
}
