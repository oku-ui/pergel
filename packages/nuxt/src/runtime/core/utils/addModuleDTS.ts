import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import { firstLetterUppercase } from '.'

export function addModuleDTS(data: {
  template: string
  nuxt: Nuxt
}) {
  const projectName = data.nuxt._pergel._module.projectName
  const firstLetterUppercaseProjectName = firstLetterUppercase(projectName)
  const firstLetterUppercaseModuleName = firstLetterUppercase(data.nuxt._pergel._module.moduleName)

  const template = /* ts */`
export interface ${firstLetterUppercaseProjectName + firstLetterUppercaseModuleName} {
  ${data.template.trim()}
}
      `.trim()

  const body = /* ts */`
declare module '#pergel/types' {
  interface ${firstLetterUppercaseProjectName + firstLetterUppercaseModuleName} {
    ${data.template.trim()}
  }
}
      `.trim()

  data.nuxt._pergel.dts.push({
    projectName,
    body,
    template,
    moduleName: data.nuxt._pergel._module.moduleName,
  })

  if (!existsSync(data.nuxt._pergel._module.moduleDir))
    mkdirSync(data.nuxt._pergel._module.moduleDir, { recursive: true })

  if (!existsSync(`${data.nuxt._pergel._module.moduleDir}/index.d.ts`)) {
    writeFileSync(
      `${data.nuxt._pergel._module.moduleDir}/index.d.ts`,
      body,
    )
  }
}
