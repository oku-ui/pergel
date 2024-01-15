import { join, relative, resolve } from 'node:path'
import { matchGlobs } from '../../modules/graphqlYoga/utils'
import type { NuxtPergel, PergelModuleNames } from '../types/nuxtModule'

export function globsBuilderWatch(
  nuxt: NuxtPergel,
  path: string,
  folder: string,
  ext: string,
) {
  const absolutePath = resolve(nuxt.options.rootDir, path)
  const relativePath = relative(nuxt.options.rootDir, path)

  const groups = relativePath.match(/pergel\/(?<projectName>[^\/]+)\/(?<moduleName>[^\/]+)/)?.groups
  const { projectName, moduleName } = groups || {}

  const match = matchGlobs(absolutePath, [join('**', folder, '**', `*${ext}`)])

  return {
    match,
    projectName,
    moduleName: moduleName as PergelModuleNames,
  }
}
