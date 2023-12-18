import { join } from 'node:path'
import { camelCase } from 'scule'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate } from '@nuxt/kit'
import type { NuxtPergel, ResolvedPergelOptions } from '../types'
import { useNitroImports, useNuxtImports } from './useImports'
import { firstLetterUppercase, reformatSourceCode } from '.'

export function generatePergelTemplate(
  data: {
    nuxt: Nuxt
  },
) {
  const functionsContents: {
    [projectName: string]: {
      content: string
      resolve: string
    }
  } = {}

  for (const item of data.nuxt._pergel.contents) {
    const projectName = item.projectName
    functionsContents[projectName] ??= {
      content: '',
      resolve: '',
    }
    if (typeof item.content === 'string') {
      const valueToAppend = item.content.split('\n').map(line => line.trim()).join('\n')
      functionsContents[projectName].content += `   ${valueToAppend}`
    }

    if (typeof item.resolve === 'string') {
      const valueToAppend = item.resolve.split('\n').map(line => line.trim()).join('\n')
      functionsContents[projectName].resolve += `   ${valueToAppend}`
    }
  }

  for (const [projectName, value] of Object.entries(functionsContents)) {
    const funcName = camelCase(`pergel${firstLetterUppercase(projectName)}`)

    /**
     * Export pergel function
     * @example `
     * export function pergel() {
     *  function drizzle() {
     *  return {
     *    driver: driver(),
     *  }
     *  return {
     *    drizzle: drizzle(),
     *  }
     * }
     * `
     */
    function forDTS(nuxt: NuxtPergel) {
      let _interfaces = ''
      for (const project of Object.keys(nuxt._pergel.dts)) {
        const interfaces = Object.values(nuxt._pergel.dts[project]).map(module => module.interfaceNames.join(', ')).join(', ')
        _interfaces += interfaces
      }

      return _interfaces
    }

    const pergel = addTemplate({
      filename: join(data.nuxt._pergel.dir.pergel, projectName, 'pergel.ts'),
      write: true,
      getContents: () => {
        const fixFunction = value.content.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const fixReturn = value.resolve.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const source = /* ts */` // Pergel Auto Generated - https://oku-ui.com
          import type { PergelGlobalContextOmitModule } from '#pergel'

          ${typeof data.nuxt._pergel.dts[projectName] === 'object'
? `
import type {
  ${forDTS(data.nuxt)}
} from '#pergel/types'
`
: ''}

          export function ${funcName}() {
              const ctx: PergelGlobalContextOmitModule = {
                projectName: '${projectName}'
              }
              ${fixFunction}
                return {
                  ${fixReturn}
              }
            }
          `.trim()

        return reformatSourceCode(source)
      },
    })

    useNuxtImports(data.nuxt, {
      presets: [
        {
          from: pergel.dst,
          imports: [
            funcName,
          ],
        },
      ],
    })

    useNitroImports(data.nuxt, {
      presets: [
        {
          from: pergel.dst,
          imports: [
            funcName,
          ],
        },
      ],
    })
  }
}
