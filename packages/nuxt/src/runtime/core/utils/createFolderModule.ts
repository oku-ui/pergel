import { mkdirSync } from 'node:fs'
import type { NuxtPergel } from '../types/nuxtModule'

export function createFolderModule(data: {
  nuxt: NuxtPergel
  serverDir?: string
  rootDir?: string
  projectName: string
  moduleName: string
}) {
  if (data.nuxt._pergel.exitPergelFolder && data.serverDir)
    mkdirSync(data.serverDir, { recursive: true })

  if (data.nuxt._pergel.exitPergelFolder && data.rootDir)
    mkdirSync(data.rootDir, { recursive: true })
}
