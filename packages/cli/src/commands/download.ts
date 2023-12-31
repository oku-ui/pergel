import { join, resolve } from 'node:path'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import consola from 'consola'
import type { ResolvedPergelConfig } from '../types'

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
    template: {
      alias: 't',
      description: 'Download file',
    },
  },
  async run({ args }) {
    const template = args.template as string

    // drizzle or drizzle,drizzle2,drizzle3
    const files = template.includes(',') ? template.split(',') : [template]

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

    if (!template) {
      logger.error('No template provided')
      return
    }

    for (const file of files) {
      try {
        const data = await import(join(templateDir, `${file}.mjs`))
          .then(m => m.default)
          .catch((error) => {
            logger.error(`Error loading template ${file}:`, error)
          }) as (options: {
          cwd: string
        }) => void
        data({
          cwd: process.cwd(),
        })
      }
      catch (error) {
        logger.error(`Error loading template ${file}:`, error)
      }
    }
  },
})
