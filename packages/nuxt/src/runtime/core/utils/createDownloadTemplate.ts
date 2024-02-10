import { basename, resolve } from 'node:path'
import defu from 'defu'
import type { DefineDownloadOptions, NuxtPergel } from '../types/nuxtModule'
import { generateProjectReadme } from './generateYaml'
import { writeFilePergel } from './writeFilePergel'

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
  if (write) {
    const templates = nuxt._pergel.templates ?? {}

    if (Object.keys(templates).length > 0) {
      for (const [key, value] of Object.entries(templates)) {
        const content = /* JS */ `${JSON.stringify({
          ...value,
        }, null, 2)}`

        nuxt._pergel.exitPergelFolder && writeFilePergel(resolve(nuxt._pergel.templateDir, `${key}.json`), content)
        if (input.readme && input.readme.projectName) {
          generateProjectReadme({
            data: ({ addCommentBlock }) => ({
              ...addCommentBlock('UI Download Template'),
              themes: {
                authDefault: `pergel download -t=${basename(nuxt._pergel.templateDir)} -j=${key} -p=${input.readme!.projectName}`,
              },
            }),
            nuxt,
            moduleName: input.readme.moduleName,
            projectName: input.readme.projectName,
          })
        }
      }
    }
  }
}
