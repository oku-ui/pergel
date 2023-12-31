import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import type { DefineDownloadOptions, NuxtPergel } from '../types'

function createDownloadTemplate(data: DefineDownloadOptions) {
  let { file, branch, folder } = data

  branch ??= 'main'

  if (file?.dir) {
    return /* JS */ `JSON.parse(\`${JSON.stringify({
      version: '0.1.0',
      templates: {
        'pergel-auth': {
          version: '1.0.0',
          branch,
          file,
        },
      },
    })}\`)`
  }

  if (folder && folder.length > 0) {
    return /* JS */ `JSON.parse(\`${JSON.stringify({
      version: '0.1.0',
      templates: {
        'pergel-auth': {
          version: '1.0.0',
          branch,
          folder,
        },
      },
    })}\`)`
  }
}

export function writeDownloadTemplate(nuxt: NuxtPergel, fileName: string, options: DefineDownloadOptions) {
  const pergel = resolve(nuxt._pergel.templateDir, `${fileName}.mjs`)
  const data = createDownloadTemplate(options)
  if (!data)
    return

  writeFileSync(pergel, data, {
    encoding: 'utf-8',
  })
}
