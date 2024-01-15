import { join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import consola from 'consola'
import { defineDownload, definePergelLoadConfig } from '../core'

const logger = consola.create({
  defaults: {
    tag: 'pergel:download',
  },
})

export default defineCommand({
  meta: {
    name: 'Pergel Download',
    description: 'Download Nuxt Template',
    version: '0.0.1',
  },
  args: {
    jsonFile: {
      alias: 'j',
      description: 'Download file',
    },
    template: {
      alias: 't',
      description: 'Download file',
    },
    projectName: {
      alias: 'p',
      description: 'Project name',
    },
  },
  async run({ args }) {
    const template = args.template as string
    const jsonFile = args.jsonFile as string
    const projectName = args.projectName as string

    const file = await definePergelLoadConfig()

    if (!file.config) {
      logger.error('No config file found')
      return
    }

    const templateDir = resolve(file.config.dir.template)

    const data = readFileSync(join(templateDir, `${jsonFile}.json`), 'utf-8')

    if (!data) {
      logger.error(`No file found for ${file}`)
      return
    }

    const jsonData = JSON.parse(data)

    if (!jsonData) {
      logger.error(`No data found for ${file}`)
      return
    }

    if (!jsonData) {
      logger.error(`No template found for ${template}`)
      return
    }
    if (jsonData) {
      logger.info(`Downloading template: ${template} ...`)
      const data = defineDownload({
        file: jsonData.file,
        folder: jsonData.folder,
        branch: jsonData.branch,
        tempOutput: '.tempPergel',
        projectName,
      })

      await data({
        cwd: process.cwd(),
      })

      logger.success(`Downloaded template: ${template}`)
    }
  },
})
