import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
    const projectName = options.projectName
    const firstLetterProjectName = projectName.charAt(0).toUpperCase()

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

          let readFile = readFileSync(join(dir, file.fileName), 'utf-8')

          if (file.replace?.from && file.replace?.to)
            readFile.replace(file.replace?.from, file.replace?.to)

          readFile = readFile.replace(`/changeName/g`, projectName)
            .replace(`/ChangeName/g`, firstLetterProjectName)

          writeFileSync(
            resolve(output),
            readFile,
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
            const _file = filename(_output) + extname(_output)

            if (!existsSync(_output)) {
              mkdirSync(_dirname, {
                recursive: true,
              })
            }

            let readFile = readFileSync(join(file), 'utf-8')

            if (folder.replace?.from !== 'changeName')
              readFile.replace(folder.replace?.from || 'changeName', folder.replace?.to || projectName)

            readFile = readFile.replace(`/changeName/g`, projectName).replace(`/ChangeName/g`, firstLetterProjectName)

            writeFileSync(
              join(_output),
              readFile,
            )

            logger.success(`Downloaded template folder: ${_file}`)
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
