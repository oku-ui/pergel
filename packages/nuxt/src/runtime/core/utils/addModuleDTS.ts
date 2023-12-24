import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { ResolvedModuleOptions } from '../types'

export function addModuleDTS(data: {
  template: string
  projectName: string
  moduleName: string
  interfaceNames: string[]
  nuxt: Nuxt
  moduleOptions: ResolvedModuleOptions
}) {
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

  if (!existsSync(`${data.moduleOptions.moduleDir}/index.d.ts`)) {
    writeFileSync(
      `${data.moduleOptions.moduleDir}/index.d.ts`,
      body,
    )
  }
  return {
    path: `${data.moduleOptions.moduleDir}/index.d.ts`,
  }
}
