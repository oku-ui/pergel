import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { consola } from 'consola'
import { parse } from 'yaml'
import { parseNa, run } from '@antfu/ni'
import type { PergelConfig, PergelYaml } from '../types'

export default defineCommand({
  meta: {
    name: 'Orm Command',
    description: 'Orm Command',
    version: '0.0.0',
  },
  args: {
    driver: {
      type: 'string',
      description: 'Name of the orm',
      alias: 'd',
    },
    project: {
      type: 'string',
      description: 'Name of the project',
      alias: 'p',
    },
    script: {
      type: 'string',
      description: 'Name of the script',
      alias: 's',
    },
  },
  async run({ args }) {
    try {
      const file = await loadConfig<Required<PergelConfig>>({
        cwd: process.cwd(),
        configFile: 'pergel.config.ts',
        defaultConfig: {
          src: 'pergel',
          selectProject: args.project,
          cli: {
            database: {
              driver: (args.driver as any) ?? 'drizzle',
              project: args.project,
              selectedScript: args.script,
            },
          },
        },
      })

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      if (!file.config.cli || !file.config.cli.database) {
        consola.error('Pergel config file is not configured')
        return
      }

      const readmeString = readFileSync(resolve(file.config.src, 'README.yaml')).toString()
      const json = parse(readmeString) as PergelYaml

      const project = json[file.config.cli.database.project][file.config.cli.database.driver ?? 'drizzle']

      const script = project?.scripts ?? {}

      if (Object.keys(script).length === 0)
        consola.error('No script found')

      const selectedScript = script[file.config.cli.database.selectedScript ?? 'undefined']

      if (!selectedScript)
        consola.error('No script found')

      try {
        await run(async (agent, args, ctx) => {
          const command = await parseNa(agent, args, ctx)
          return command ? command.replace(/"/g, '') : undefined
        }, [selectedScript], { programmatic: true }).then(() => {
          consola.success('Script executed successfully')
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
