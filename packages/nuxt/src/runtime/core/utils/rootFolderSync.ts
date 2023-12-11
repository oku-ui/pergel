import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { PergelOptions } from '../types'

/**
 * Syncs the root folder with the pergel folder
 */
export function rootFolderSync(resolvePergelDir: string, options: PergelOptions) {
  if (!existsSync(resolvePergelDir))
    mkdirSync(resolvePergelDir, { recursive: true })

  const projectNames = Object.keys(options.projects).sort()

  for (const project of projectNames) {
    const projectFolder = join(resolvePergelDir, project)

    if (!existsSync(projectFolder))
      mkdirSync(projectFolder, { recursive: true })
  }

  return {
    projectNames,
  }
}
