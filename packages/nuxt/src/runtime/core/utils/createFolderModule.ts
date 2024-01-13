import { existsSync, mkdirSync, rmdirSync } from 'node:fs'
import { dirname } from 'node:path'
import type { NuxtPergel } from '../types'

export function createFolderModule(data: {
  nuxt: NuxtPergel
  serverDir?: string
  rootDir?: string
}) {
  if (data.nuxt._pergel.exitPergelFolder && data.serverDir) {
    const serverFolder = dirname(data.serverDir)
    if (!existsSync(serverFolder))
      mkdirSync(serverFolder, { recursive: true })
  }

  if (data.nuxt._pergel.exitPergelFolder && data.rootDir) {
    const rootFolder = dirname(data.rootDir)
    if (!existsSync(rootFolder))
      mkdirSync(rootFolder, { recursive: true })
  }
}
