import { join } from 'node:path'
import { camelCase } from 'scule'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate } from '@nuxt/kit'
import { useNitroImports, useNuxtImports } from './useImports'
import { reformatSourceCode } from './utils'

export function generatePergelTemplate(
  data: {
    nuxt: Nuxt
  },
) {
  const functionsContents: {
    [projectName: string]: {
      content: string
      resolve: string
      before?: string[]
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
    functionsContents[projectName].before = item.before
  }

  for (const [projectName, value] of Object.entries(functionsContents)) {
    const funcName = camelCase(`pergel-${projectName}`)

    const pergel = addTemplate({
      filename: join(data.nuxt._pergel.dir.pergel, projectName, 'types.ts'),
      write: true,
      getContents: () => {
        const fixFunction = value.content.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const fixReturn = value.resolve.replace(/\\n/g, '\n').replace(/"/g, '').replace(/\\/g, '')
        const source = /* ts */` // Pergel Auto Generated - https://oku-ui.com
          import type { PergelGlobalContextOmitModule } from '#pergel/types'

          ${value.before?.join('\n') ?? ''}
          // Function
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

    data.nuxt.options.alias[`${projectName}/types`] = pergel.dst
    data.nuxt.options.nitro.alias ??= {}
    data.nuxt.options.nitro.alias[`${projectName}/types`] = pergel.dst

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
