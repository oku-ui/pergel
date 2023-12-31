import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import type { NuxtPergel } from '../types'

interface DefineDownloadOptions {
  file?: {
    /**
     * Directory of file
     * @example
     * `packages/nuxt`
     */
    dir: string
    /**
     * File name
     * @example
     * `pergel.config.ts`
     */
    path: {
      /**
       * File name
       * @example
       * `pergel.config.ts`
       */
      fileName: string
      /**
       * Output file name
       * @example
       * `pergel.config.ts`
       */
      outputFileName: string
    }[]
    /**
     * Folder name
     * @default
     * `.tempPergel`
     */
    tempOutput?: string
  }
  folder?: {
    dir: string
    output: string
  }[]
  branch?: string
}

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
