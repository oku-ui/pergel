import { copyFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { defu } from 'defu'
import { consola } from 'consola'
import type { DefineDownloadOptions, PergelConfig } from './types'

const logger = consola.create({
  defaults: {
    tag: 'pergel:download',
  },
})

export function definePergel(config: PergelConfig) {
  return config
}

export function defineDownload(options: DefineDownloadOptions) {
  async function setup(data: {
    cwd: string
  }) {
    const { cwd } = data
    const githubRepo = 'github:oku-ui/pergel'

    options = defu(options, {
      file: {
        tempOutput: '.tempPergel',
      },
      branch: 'main',
    }) as DefineDownloadOptions

    if (options.file?.dir) {
      const { source, dir } = await downloadTemplate(join(githubRepo, `${options.file.dir}#${options.branch}`), {
        dir: options.file.tempOutput,
        cwd,
        force: true,
      })

      const output = join(cwd, options.file.output)

      const arrayFile = Array.isArray(options.file.file) ? options.file.file : [options.file.file]

      for (const file of arrayFile) {
        copyFileSync(
          join(dir, file),
          resolve(output),
        )
      }

      rmSync(dir, {
        recursive: true,
        force: true,
        retryDelay: 100,
      })

      logger.success(`Downloaded template file: ${output}`)

      return { source, dir }
    }

    if (options.folder && options.folder.length) {
      for (const folder of options.folder) {
        const { dir } = await downloadTemplate(join(githubRepo, `${folder.dir}#${options.branch}`), {
          dir: folder.output,
          cwd,
          force: true,
        })

        logger.success(`Downloaded template folder: ${dir}`)
      }
    }
  }
  return setup
}
