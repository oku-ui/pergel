import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { downloadTemplate } from 'giget'
import { defu } from 'defu'
import { consola } from 'consola'
import { filename } from 'pathe/utils'
import { extname } from 'pathe'
import type { DefineDownloadOptions, PergelConfig } from './types'
import { scanAnyFiles } from './scan'

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
        }

        const scanDir = await scanAnyFiles({
          options: {
            scanDirs: [folder.dir],
          },
        }, dir)

        if (scanDir.length > 0) {
          for (const file of scanDir) {
            const _output = join(folder.output, file.replace(dir, ''))

            const _dirname = dirname(_output)
            // const _file = filename(_output) + extname(_output)

            if (!existsSync(_output)) {
              mkdirSync(_dirname, {
                recursive: true,
              })
            }

            if (!existsSync(_output)) {
              copyFileSync(
                join(file),
                join(_output),
              )
              logger.success(`Downloaded template folder: ${_dirname}`)
            }
          }
        }
      }
    }

    rmSync(options.tempOutput, {
      recursive: true,
      force: true,
    })
  }
  return setup
}
