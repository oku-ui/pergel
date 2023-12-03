import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { consola } from 'consola'
import { parse } from 'yaml'
import { parseNi, run } from '@antfu/ni'

export default defineCommand({
  meta: {
    name: 'Pergel Install',
    description: 'Install dependencies from README.yaml',
    version: '0.0.1',
  },
  async run() {
    try {
      const file = await loadConfig({
        cwd: process.cwd(),
        configFile: 'pergel.config.ts',
      }).catch(() => {
        return {
          config: {
            src: 'src',
            activeBranch: 'main',
          },
        }
      })

      if (!file?.config) {
        file.config = {
          src: 'src',
          activeBranch: 'main',
        }
      }

      const readmeString = readFileSync(resolve(file.config.src, 'README.yaml')).toString()

      const json = parse(readmeString)

      const activeBranch = json[file.config.activeBranch ?? 'main'] as Record<string, Record<string, { packageJson: { dependencies?: string, devDependencies?: string } }>>

      const dependencies: Set<string> = new Set()
      const devDependencies: Set<string> = new Set()

      for (const [_moduleName, moduleData] of Object.entries(activeBranch)) {
        for (const [_projectName, projectData] of Object.entries(moduleData)) {
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
