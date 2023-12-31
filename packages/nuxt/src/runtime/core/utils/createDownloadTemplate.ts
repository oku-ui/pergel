import type { DefineDownloadOptions } from 'pergel/types'

/**
 * @default
 * branch: 'main'
 */
export function createDownloadTemplate(data: DefineDownloadOptions) {
  let { file, branch, folder } = data

  branch ??= 'main'

  if (file?.dir) {
    return /* TS */ `import { defineDownload } from 'pergel/core'
    export default defineDownload({
        branch: '${branch}',
        file: {
            dir: '${file.dir}',
            output: '${file.output}',
            file: '${file.file}',
            tempOutput: '${file.tempOutput}',
        },
    })
        `
  }

  if (folder?.dir) {
    return /* TS */ `import { defineDownload } from 'pergel/core'
        export default defineDownload({
            branch: '${branch}',
            folder: {
                dir: '${folder.dir}',
                output: '${folder.output}',
            },
        })
            `
  }
}
