import { join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import consola from 'consola'
import type { ResolvedPergelConfig } from '../types'
import { defineDownload } from '../core'

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
  },
  async run({ args }) {
    const template = args.template as string
    const jsonFile = args.jsonFile as string

    const file = await loadConfig<ResolvedPergelConfig>({
      cwd: process.cwd(),
      configFile: 'pergel.config.ts',
      defaultConfig: {
        src: 'pergel',
        templateDir: 'pergel/templates',
      },
    })

    if (!file.config) {
      logger.error('No config file found')
      return
    }

    const templateDir = resolve(file.config.templateDir)

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

    if (!jsonData.templates[template]) {
      logger.error(`No template found for ${template}`)
      return
    }

    const _template = jsonData.templates[template]
    if (_template) {
      logger.info(`Downloading template: ${template} ...`)
      const data = defineDownload({
        file: _template.file,
        folder: _template.folder,
      })

      await data({
        cwd: process.cwd(),
      })

      logger.success(`Downloaded template: ${template}`)
    }
  },
})
