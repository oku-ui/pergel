import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
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
      tempOutput: '.tempPergel',
      branch: 'main',
    }) as DefineDownloadOptions

    if (options.file?.dir) {
      const { dir } = await downloadTemplate(join(githubRepo, `${options.file.dir}#${options.branch}`), {
        dir: options.tempOutput,
        cwd,
        force: true,
      })

      for (const file of options.file.path) {
        const output = resolve(join(cwd, file.outputFileName))
        const _dirname = dirname(output)

        if (!existsSync(output)) {
          if (!existsSync(_dirname)) {
            mkdirSync(_dirname, {
              recursive: true,
            })
          }

          copyFileSync(
            join(dir, file.fileName),
            resolve(output),
          )
        }
        else if (file.forceClean) {
          rmSync(output, {
            recursive: true,
            force: true,
          })

          if (!existsSync(_dirname)) {
            mkdirSync(_dirname, {
              recursive: true,
            })
          }

          copyFileSync(
            join(dir, file.fileName),
            resolve(output),
          )
        }

        logger.success(`Downloaded template file: ${output}`)
      }
    }

    if (options.folder && options.folder.length) {
      for (const folder of options.folder) {
        const { dir } = await downloadTemplate(join(githubRepo, `${folder.dir}#${options.branch}`), {
          dir: options.tempOutput,
          cwd,
          force: true,
          forceClean: folder.forceClean !== false,
        })

        // check folder
        if (!existsSync(resolve(folder.output))) {
          mkdirSync(resolve(folder.output), {
            recursive: true,
          })

          copyFileSync(
            join(dir, folder.dir),
            resolve(folder.output),
          )
        }

        logger.success(`Downloaded template folder: ${dir}`)
      }
    }

    rmSync(options.tempOutput, {
      recursive: true,
      force: true,
    })
  }
  return setup
}
