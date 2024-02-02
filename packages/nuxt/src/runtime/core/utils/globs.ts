import { join, resolve } from 'node:path'
import { matchGlobs } from '../../modules/graphqlYoga/utils'
import type { NuxtPergel } from '../types/nuxtModule'

export function globsBuilderWatch(
  nuxt: NuxtPergel,
  path: string,
  ext: string = '.ts',
  custom?: string,
) {
  const absolutePath = resolve(nuxt.options.rootDir, path)
  const dirs = nuxt._pergel.watchDirs
  const match = matchGlobs(
    absolutePath,
    [...dirs.map(({ serverDir }) => {
      return join('**', join(serverDir, custom ?? ''), '**', `*${ext}`)
    }), ...dirs.map(({ rootModuleDir }) => {
      return join('**', rootModuleDir, '**', `*${ext}`)
    })],
  )

  if (!match)
    return false

  const { serverDir, projectName, moduleName } = dirs.find(({ serverDir, rootModuleDir }) => {
    return match.glob.includes(serverDir) || match.glob.includes(rootModuleDir)
  })!

  return {
    match,
    serverDir,
    projectName,
    moduleName,
  }
}
