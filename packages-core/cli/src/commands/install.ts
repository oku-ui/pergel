import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { parseNi, run } from '@antfu/ni'
import type { PergelReadme } from '../types'
import { definePergelLoadConfig } from '../core'

export default defineCommand({
  meta: {
    name: 'Pergel Install',
    description: 'Install dependencies from README.json',
    version: '0.2.0',
  },
  async run() {
    const args = process.argv.slice(2).filter(arg => arg !== 'install' && arg !== 'pergel')

    try {
      const file = await definePergelLoadConfig()

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      const readmeString = readFileSync(resolve(join(file.config.dir?.pergel, 'README.json')), 'utf-8')
      const jsonData: PergelReadme = JSON.parse(readmeString)

      const dependencies: Set<string> = new Set()
      const devDependencies: Set<string> = new Set()

      for (const [_moduleName, moduleData] of Object.entries(jsonData)) {
        if (!moduleData)
          continue

        for (const [_projectName, projectData] of Object.entries(moduleData)) {
          if (!projectData) {
            consola.error(`No project data found for ${_projectName}`)
            continue
          }
          if (projectData.packageJson) {
            if (projectData.packageJson.dependencies) {
              const debs = Object.keys(projectData.packageJson.dependencies)
              if (debs.length) {
                for (const item of debs) {
                  if (item)
                    dependencies.add(`${item}@${projectData.packageJson.dependencies[item as keyof typeof projectData.packageJson.dependencies]}`)
                }
              }
            }

            if (projectData.packageJson.devDependencies) {
              const debs = Object.keys(projectData.packageJson.devDependencies)
              if (debs.length) {
                for (const item of debs) {
                  if (item)
                    devDependencies.add(`${item}@${projectData.packageJson.devDependencies[item as keyof typeof projectData.packageJson.devDependencies]}`)
                }
              }
            }
          }
        }
      }

      if (dependencies.size) {
        await run(parseNi, [...dependencies.values(), ...args]).then(() => {
          consola.success('Dependencies installed', dependencies.values())
        })
      }
      if (devDependencies.size) {
        await run(parseNi, [...devDependencies.values(), '-D', ...args]).then(() => {
          consola.success('Dev dependencies installed', devDependencies.values())
        })
      }
    }
    catch (error) {
      consola.info('Please run `pergel init` to create a config folder. After that, you can run `pergel install` to install dependencies.')
      const confirm = await consola.prompt('Would you like to run `pergel init` now?', {
        type: 'confirm',
      })
      if (confirm) {
        await run(parseNi, ['pergel', 'init']).then(async () => {
          consola.success('Config folder created')

          await run(parseNi, ['nuxt', 'prepare']).then(() => {
            consola.success('Nuxt prepared')
          })
        }).catch(() => {
          consola.error('Failed to create config folder')
        })
      }
    }
  },
})
