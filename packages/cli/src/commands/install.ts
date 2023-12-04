import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { consola } from 'consola'
import { parse } from 'yaml'
import { parseNi, run } from '@antfu/ni'
import type { PergelYaml } from '../types'

export default defineCommand({
  meta: {
    name: 'Pergel Install',
    description: 'Install dependencies from README.yaml',
    version: '0.0.1',
  },
  async run() {
    try {
      const file = await loadConfig<{
        src: string
      }>({
        cwd: process.cwd(),
        configFile: 'pergel.config.ts',
        defaultConfig: {
          src: 'pergel',
        },
      })

      if (!file.config) {
        consola.error('No config file found')
        return
      }

      const readmeString = readFileSync(resolve(file.config.src, 'README.yaml')).toString()

      const json = parse(readmeString) as PergelYaml

      const selectProject = json

      const dependencies: Set<string> = new Set()
      const devDependencies: Set<string> = new Set()

      for (const [_moduleName, moduleData] of Object.entries(selectProject)) {
        if (!moduleData)
          continue

        for (const [_projectName, projectData] of Object.entries(moduleData)) {
          if (!projectData) {
            consola.error(`No project data found for ${_projectName}`)
            continue
          }
          if (projectData.packageJson) {
            if (projectData.packageJson.dependencies) {
              const deps = projectData.packageJson.dependencies.split(',').map(item => item.trim())
              deps.forEach((item) => {
                if (item)
                  dependencies.add(item)
              })
            }

            if (projectData.packageJson.devDependencies) {
              const deps = projectData.packageJson.devDependencies.split(',').map(item => item.trim())
              deps.forEach((item) => {
                if (item)
                  devDependencies.add(item)
              })
            }
          }
        }
      }

      if (dependencies.size) {
        await run(parseNi, [...dependencies.values()]).then(() => {
          consola.success('Dependencies installed', dependencies.values())
        })
      }
      if (devDependencies.size) {
        await run(parseNi, [...devDependencies.values(), '-D']).then(() => {
          consola.success('Dev dependencies installed', devDependencies.values())
        })
      }
    }
    catch (error) {
      consola.log(error)
    }
  },
})
