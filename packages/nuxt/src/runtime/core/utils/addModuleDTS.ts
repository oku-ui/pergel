import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { ResolvedModuleOptions } from '../types'

export function addModuleDTS(data: {
  template?: string
  projectName: string
  moduleName: string
  pergelFolderTemplate?: string
  interfaceNames: string[]
  nuxt: Nuxt
  moduleOptions: ResolvedModuleOptions
}) {
  if (data.template) {
    data.nuxt._pergel.dts[data.projectName] ??= {}
    data.nuxt._pergel.dts[data.projectName][data.moduleName] ??= {
      interfaceNames: [],
      template: [],
    }
    data.nuxt._pergel.dts[data.projectName][data.moduleName].interfaceNames.push(...data.interfaceNames)
    data.nuxt._pergel.dts[data.projectName][data.moduleName].template.push(data.template)

    if (!existsSync(data.moduleOptions.moduleDir))
      mkdirSync(data.moduleOptions.moduleDir, { recursive: true })

    const body = /* ts */`
declare module 'pergel/${data.projectName}/types' {
  ${data.template.replace('export ', '')}
}
      `.trim()

    if (!existsSync(`${data.moduleOptions.moduleDir}/types.ts`)) {
      writeFileSync(
        `${data.moduleOptions.moduleDir}/types.ts`,
        body,
      )
    }
  }

  if (data.pergelFolderTemplate) {
    if (!existsSync(`${data.moduleOptions.moduleDir}/types.ts`)) {
      writeFileSync(
        `${data.moduleOptions.moduleDir}/types.ts`,
        data.pergelFolderTemplate,
      )
    }
  }

  return {
    path: `${data.moduleOptions.moduleDir}/types.ts`,
  }
}
