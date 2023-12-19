import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'

export function addModuleDTS(data: {
  template: string
  projectName: string
  moduleName: string
  interfaceNames: string[]
  nuxt: Nuxt
}) {
  data.nuxt._pergel.dts[data.projectName] ??= {}
  data.nuxt._pergel.dts[data.projectName][data.moduleName] ??= {
    interfaceNames: [],
    template: [],
  }
  data.nuxt._pergel.dts[data.projectName][data.moduleName].interfaceNames.push(...data.interfaceNames)
  data.nuxt._pergel.dts[data.projectName][data.moduleName].template.push(data.template)

  if (!existsSync(data.nuxt._pergel._module.moduleDir))
    mkdirSync(data.nuxt._pergel._module.moduleDir, { recursive: true })

  const body = /* ts */`
declare module 'pergel/${data.projectName}/types' {
  ${data.template.replace('export ', '')}
}
      `.trim()

  if (!existsSync(`${data.nuxt._pergel._module.moduleDir}/index.d.ts`)) {
    writeFileSync(
      `${data.nuxt._pergel._module.moduleDir}/index.d.ts`,
      body,
    )
  }
  return {
    path: `${data.nuxt._pergel._module.moduleDir}/index.d.ts`,
  }
}
