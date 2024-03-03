import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { parseNa, run } from '@antfu/ni'
import { definePergelLoadConfig } from '../core'

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
    custom: {
      type: 'boolean',
      description: 'Custom script',
      alias: 'c',
    },
  },
  async run({ args }) {
    try {
      const file = await definePergelLoadConfig()

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      const readmeString = readFileSync(resolve(file.config.dir.pergel, 'README.json')).toString()

      const project = JSON.parse(readmeString)[args.project ?? '']?.[args.module ?? '']

      const script = project?.scripts ?? {}

      if (Object.keys(script).length === 0)
        consola.error('No script found')

      const selectedScript = script[args.script ?? '']

      if (!selectedScript)
        consola.error('No script found')

      if (!args.custom) {
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
      else {
        execSync(selectedScript, {
          stdio: 'inherit',
          cwd: file.config.dir.pergel,
        })
      }
    }
    catch (error) {
      consola.log(error)
    }
  },
})
