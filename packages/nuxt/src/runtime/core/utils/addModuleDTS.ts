import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { ResolvedPergelOptions } from '../types'
import { firstLetterUppercase } from '.'

export function addModuleDTS(data: {
  template: string
  options: ResolvedPergelOptions
  nuxt: Nuxt
}) {
  const projectName = data.options.resolvedModule.projectName
  const firstLetterUppercaseProjectName = firstLetterUppercase(projectName)
  const firstLetterUppercaseModuleName = firstLetterUppercase(data.options.resolvedModule.name)

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
  })

  if (!existsSync(data.options.resolvedModule.moduleDir))
    mkdirSync(data.options.resolvedModule.moduleDir, { recursive: true })

  if (!existsSync(`${data.options.resolvedModule.moduleDir}/index.d.ts`)) {
    writeFileSync(
      `${data.options.resolvedModule.moduleDir}/index.d.ts`,
      body,
    )
  }
}
