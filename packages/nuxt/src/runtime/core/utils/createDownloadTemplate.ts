import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import type { DefineDownloadOptions } from 'pergel/types'
import type { NuxtPergel } from '../types'

function createDownloadTemplate(data: DefineDownloadOptions) {
  let { file, branch, folder } = data

  branch ??= 'main'

  if (file?.dir) {
    return /* TS */ `import { defineDownload } from 'pergel/core'
    
export default defineDownload({
    branch: '${branch}',
    file: ${JSON.stringify(file)},
})
        `.trim()
  }

  if (folder && folder.length > 0) {
    return /* TS */ `import { defineDownload } from 'pergel/core'
    
export default defineDownload({
    branch: '${branch}',
    folder: ${JSON.stringify(folder)},
})
            `.trim()
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
