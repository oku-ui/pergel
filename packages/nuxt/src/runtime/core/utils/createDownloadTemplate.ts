import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import defu from 'defu'
import type { DefineDownloadOptions, NuxtPergel } from '../types'
import { generateProjectReadme } from './generateYaml'

export function writeDownloadTemplate(nuxt: NuxtPergel) {
  const templates = nuxt._pergel.templates

  const pergel = resolve(nuxt._pergel.templateDir, 'templates.json')

  const content = /* JS */ `${JSON.stringify({
    version: '0.1.0',
    templates,
  }, null, 2)}`

  writeFileSync(pergel, content, {
    encoding: 'utf-8',
  })
}

export function addDownloadTemplate(
  input: {
    nuxt: NuxtPergel
    name?: string
    version?: string
    data?: DefineDownloadOptions
    write?: boolean
    readme?: {
      projectName: string
      moduleName: string
    }
  },
) {
  let { nuxt, name, version, data, write } = input

  if (!version)
    version = '0.0.0'

  if (name && data) {
    nuxt._pergel.templates ??= {}
    nuxt._pergel.templates[name] ??= {}
    nuxt._pergel.templates[name].version = version
    nuxt._pergel.templates[name].branch = data.branch ?? 'main'
    nuxt._pergel.templates[name].file = defu(nuxt._pergel.templates[name].file, data.file ?? {})
    nuxt._pergel.templates[name].folder ??= []
    nuxt._pergel.templates[name].folder?.push(...data.folder ?? [])
  }
  const fileName = 'templates'
  if (write) {
    const templates = nuxt._pergel.templates ?? {}

    const pergel = resolve(nuxt._pergel.templateDir, `${fileName}.json`)

    if (Object.keys(templates).length > 0) {
      const content = /* JS */ `${JSON.stringify({
        version: '0.1.0',
        templates,
      }, null, 2)}`

      writeFileSync(pergel, content, {
        encoding: 'utf-8',
      })
    }

    const content = /* JS */ `${JSON.stringify({
      version: '0.1.0',
      templates,
    }, null, 2)}`

    writeFileSync(pergel, content, {
      encoding: 'utf-8',
    })
  }

  if (input.readme) {
    generateProjectReadme({
      data: ({ addCommentBlock }) => ({
        ...addCommentBlock('UI Download Template'),
        themes: {
          authDefault: `pergel download -t=${name} -j=${fileName}`,
        },
      }),
      nuxt,
      moduleName: input.readme.moduleName,
      projectName: input.readme.projectName,
    })
  }
}
