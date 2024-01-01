import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { consola } from 'consola'
import { parse } from 'yaml'
import { parseNa, run } from '@antfu/ni'
import type { PergelYaml, ResolvedPergelConfig } from '../types'

export default defineCommand({
  meta: {
    name: 'Module Command',
    description: 'Module Command',
    version: '0.0.0',
  },
  args: {
    project: {
      type: 'string',
      description: 'Name of the project',
      alias: 'p',
    },
    module: {
      type: 'string',
      description: 'Name of the module',
      alias: 'm',
    },
    script: {
      type: 'string',
      description: 'Name of the script',
      alias: 's',
    },
  },
  async run({ args }) {
    try {
      const file = await loadConfig<Required<ResolvedPergelConfig>>({
        cwd: process.cwd(),
        configFile: 'pergel.config.ts',
        defaultConfig: {
          dir: {
            pergel: 'pergel',
            template: 'pergel/templates',
          },
          filePath: {
            nuxtConfig: 'nuxt.config.ts',
          },
        },
      })

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      const readmeString = readFileSync(resolve(file.config.dir.pergel, 'README.yaml')).toString()
      const json = parse(readmeString) as PergelYaml

      const project = json[args.project]?.[args.module]

      const script = project?.scripts ?? {}

      if (Object.keys(script).length === 0)
        consola.error('No script found')

      const selectedScript = script[args.script ?? '']

      if (!selectedScript)
        consola.error('No script found')

      try {
        await run(async (agent, args, ctx) => {
          const command = await parseNa(agent, args, ctx)
          return command ? command.replace(/"/g, '') : undefined
        }, [selectedScript], { programmatic: true }).then(() => {
          consola.success('Script executed successfully')
        }).catch((error) => {
          consola.error(error)
        })
      }
      catch (error) {
        consola.error(error)
      }
    }
    catch (error) {
      consola.log(error)
    }
  },
})
