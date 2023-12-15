import { join } from 'node:path'
import { camelCase } from 'scule'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate } from '@nuxt/kit'
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
    // import type {
    //   TestBullmq
    // } from '#pergel/types'
    const pergel = addTemplate({
      filename: join(data.nuxt._pergel.dir.pergel, projectName, 'pergel.ts'),
      write: true,
      getContents: () => {
        const fixFunction = value.content.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const fixReturn = value.resolve.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const source = /* ts */` // Pergel Auto Generated - https://oku-ui.com
          import type { PergelGlobalContextOmitModule } from '#pergel'

          ${data.nuxt._pergel.dts.find(dts => dts.projectName === projectName)
? `
import type {
  ${data.nuxt._pergel.dts.map(dts => `${firstLetterUppercase(dts.projectName) + firstLetterUppercase(dts.moduleName)}`).join(',\n')}
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
