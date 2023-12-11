import { join, resolve } from 'node:path'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate } from '@nuxt/kit'
import defu from 'defu'
import type { PergelOptions, ResolvedPergelOptions } from './types'
import { rootFolderSync } from './utils/rootFolderSync'

export async function setupPergel(options: PergelOptions, nuxt: Nuxt) {
  const rootDir = options.rootDir ? options.rootDir : './'
  const pergelDir = join(rootDir, options.pergelDir ?? 'pergel')
  const readmePath = join(pergelDir, 'README.yaml')

  const resolveDir = resolve(join(nuxt.options.rootDir, rootDir))
  const resolvePergelDir = resolve(join(nuxt.options.rootDir, pergelDir))
  const resolveReadmePath = resolve(join(nuxt.options.rootDir, readmePath))

  const { projectNames } = rootFolderSync(resolvePergelDir, options)

  const pergelType = addTemplate({
    filename: 'pergel/types.ts',
    write: true,
    getContents: () => {
      return /* TypeScript */ `
          export type ProjectName = ${projectNames.map((projectName) => {
        return `'${projectName}'`
      }).join(' | ')}
          export type Module = ${nuxt._pergel.modules.map((module) => { return `'${module}'` }).join(' | ')}

          export type PergelGlobalContextOmitModule = Omit<PergelGlobalContext, 'moduleName'>

          export interface PergelGlobalContext {
            projectName: ProjectName
            moduleName: Module
          }
        `.trim().replace(/ {10}/g, '')
    },
  })

  nuxt.options.alias['#pergel'] = pergelType.dst
  nuxt.options.nitro.alias ??= {}
  nuxt.options.nitro.alias['#pergel'] = pergelType.dst

  const resolvedOptions = defu(options, {
    projects: {
    },
    esnext: true,
    pergelDir,
    rootDir,
  } as PergelOptions)

  const resolvedPergelOptions = defu({
    rootOptions: resolvedOptions,
    resolvedOptions: {
      projectNames,
      dir: {
        pergel: resolvedOptions.pergelDir ?? 'pergel',
        readme: join('pergel', 'README.yaml'),
        root: options.rootDir ?? './',
      },
      resolveDir: {
        root: resolveDir,
        pergelRoot: resolve(resolveDir, resolvedOptions.pergelDir ?? 'pergel'),
        readmeDir: resolve(resolveReadmePath),
      },
      templateDir: {
        root: 'pergel',
      },
    },
    resolvedModule: {
      dir: {
        project: '',
        module: '',
      },
      moduleDir: '',
      name: '',
      projectDir: '',
      projectName: '',
      templateDir: {
        module: '',
        project: '',
        root: 'pergel',
      },
    },
  } as ResolvedPergelOptions, {
    rootOptions: resolvedOptions,
    resolvedOptions: {
      projectNames,
      dir: {
        pergel: resolvedOptions.pergelDir ?? 'pergel',
        readme: join('pergel', 'README.yaml'),
        root: options.rootDir ?? './',
      },
      resolveDir: {
        readmeDir: resolve(resolveReadmePath),
        root: resolveDir,
        pergelRoot: resolve(resolveDir, resolvedOptions.pergelDir ?? 'pergel'),
      },
      templateDir: {
        root: 'pergel',
      },
    },
    resolvedModule: {

    },
  } as ResolvedPergelOptions)

  return {
    resolvedPergelOptions,
  }
}
