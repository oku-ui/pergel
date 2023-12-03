import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { consola } from 'consola'
import { parse } from 'yaml'
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
    branch: {
      type: 'string',
      description: 'Name of the branch',
      alias: 'b',
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
          activeBranch: 'main',
          cli: {
            database: {
              driver: (args.driver as any) ?? 'drizzle',
              branch: args.branch,
              project: args.project,
              selectedScript: args.script,
            },
          },
        },
      })

      consola.info(file.config?.cli.database)

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

      const project = json[file.config.activeBranch ?? 'main'][file.config.cli.database.driver ?? 'drizzle'][file.config.cli.database.project]

      const script = project?.scripts ?? {}

      if (Object.keys(script).length === 0)
        consola.error('No script found')

      const selectedScript = script[file.config.cli.database.selectedScript ?? 'undefined']

      if (!selectedScript)
        consola.error('No script found')

      if (file.config.cli.database.driver === 'drizzle')
        consola.info('If drizzle-kit is not installed globally, install it.')

      execSync(selectedScript, { stdio: 'inherit' })
    }
    catch (error) {
      consola.log(error)
    }
  },
})
