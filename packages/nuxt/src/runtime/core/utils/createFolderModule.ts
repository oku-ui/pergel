import { mkdirSync } from 'node:fs'
import { basename, parse, resolve } from 'node:path'
import type { NuxtPergel } from '../types'

export function createFolderModule(data: {
  nuxt: NuxtPergel
  serverDir?: string
  rootDir?: string
  projectName: string
  moduleName: string
}) {
  const { nuxt, projectName, moduleName } = data
  if (data.nuxt._pergel.exitPergelFolder && data.serverDir) {
    data.nuxt.options.nitro.alias ??= {}
    data.nuxt.options.nitro.alias[`#${projectName}/${moduleName}`] = resolve(
      nuxt.options.rootDir,
      data.serverDir,
    )

    mkdirSync(data.serverDir, { recursive: true })
  }

  if (data.nuxt._pergel.exitPergelFolder && data.rootDir)
    mkdirSync(data.rootDir, { recursive: true })
}
