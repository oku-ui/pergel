import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { PergelOptions } from '../types'

/**
 * Syncs the root folder with the pergel folder
 */
export function rootFolderSync(
  resolvePergelDir: string,
  templatesDir: string,
  options: PergelOptions,
) {
  if (!existsSync(resolvePergelDir))
    mkdirSync(resolvePergelDir, { recursive: true })

  if (!existsSync(templatesDir))
    mkdirSync(templatesDir, { recursive: true })

  const projectNames = Object.keys(options.projects).sort()

  for (const project of projectNames) {
    const projectFolder = join(resolvePergelDir, project)

    if (!existsSync(projectFolder))
      mkdirSync(projectFolder, { recursive: true })
  }

  // Check ts.config.json
  if (!existsSync(resolve(join(resolvePergelDir, 'tsconfig.json')))) {
    writeFileSync(resolve(join(resolvePergelDir, 'tsconfig.json')), JSON.stringify({
      extends: '../.nuxt/tsconfig.server.json',
    }, null, 2))
  }

  return {
    projectNames,
  }
}
