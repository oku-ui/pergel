import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { intro, select } from '@clack/prompts'
import { defineCommand } from 'citty'
import consola from 'consola'
import type { PergelReadme } from '../types'
import { definePergelLoadConfig } from '../core'

export default defineCommand({
  meta: {
    name: 'Pergel Upgrade',
    description: 'Upgrade Pergel CLI',
    version: '0.0.1',
  },
  async run() {
    try {
      const file = await definePergelLoadConfig()

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      intro('Oku Pergel Select CLI')

      const readmeString = readFileSync(resolve(join(file.config.dir?.pergel, 'README.json')), 'utf-8')
      const jsonData: PergelReadme = JSON.parse(readmeString)

      const projectNames = Object.keys(jsonData).filter((i) => {
        const project = jsonData[i]
        if (!project)
          return false

        for (const key in project) {
          if (project[key].cli)
            return true
        }

        return false
      })

      if (!projectNames.length) {
        consola.error('No projects found')
        return
      }

      const selectedProject = await select({
        message: 'Select a project',
        options: projectNames.map(i => ({
          label: i,
          value: i,
        })),
      })

      const selectedProjectData = jsonData[selectedProject as string]
      const cliModules = Object.keys(selectedProjectData).filter((i) => {
        const cli = selectedProjectData[i].cli
        if (cli)
          return true

        return false
      })

      const selectedModule = await select({
        message: 'Select a module',
        options: cliModules.map(i => ({
          label: i,
          value: i,
        })),
      }) as string

      if (selectedModule) {
        const selectedCli = await select({
          message: 'Select a cli command',
          options: Object.keys((selectedProjectData[selectedModule] as any).cli).map(i => ({
            label: i,
            value: i,
          })),
        })

        const cliData = (selectedProjectData[selectedModule] as any).cli[selectedCli as string]
        if (cliData) {
          consola.info(`Running ${cliData}`)
          execSync(
            cliData,
            {
              stdio: 'inherit',
            },
          )
        }
      }
    }
    catch (error) {
      consola.error(error)
    }
  },
})
