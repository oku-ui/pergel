import { join, resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import consola from 'consola'
import type { ModuleName, PergelModule, PergelModuleData, ResolvedPergelOptions } from './types'
import { generatePergelTemplate } from './utils/generatePergelTemplate'
import { generateProjectReadme } from './utils/generateYaml'

type PrepareModules = {
  [project: string]: {
    [module: string]: {
      defineModule: PergelModule
      waitModule?: string[]
    }
  }
}

class CircularDependencyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CircularDependencyError'
  }
}

async function initModules(nuxt: Nuxt, resolver: Resolver) {
  const projects = nuxt._pergel.rootOptions.projects

  const prepareModules: PrepareModules = {}

  try {
    for await (const [projectName, modules] of Object.entries(projects)) {
      for await (const [moduleName, moduleValue] of Object.entries(modules)) {
        nuxt.options.alias[`#${projectName}/${moduleName}`] = resolve(
          nuxt.options.rootDir,
          'pergel',
          projectName,
          moduleName,
        )
        nuxt.options.nitro.alias ??= {}
        nuxt.options.nitro.alias[`#${projectName}/${moduleName}`] = resolve(
          nuxt.options.rootDir,
          'pergel',
          projectName,
          moduleName,
        )

        if (typeof moduleValue === 'boolean' && moduleValue === false)
          continue

        if (
          (typeof moduleValue === 'object' && moduleValue === null)
          || (typeof moduleValue === 'object' && !moduleValue)
        )
          continue

        if (typeof moduleValue === 'string' && moduleValue === '')
          continue

        nuxt._pergel.projects[projectName] ??= {} as any
        (nuxt._pergel.projects[projectName] as any)[moduleName] = {
          ...(nuxt._pergel.projects[projectName] as any)[moduleName],
          dir: {
            project: join(projectName),
            module: join(projectName, moduleName),
          },
        } satisfies ResolvedPergelOptions['projects']['']

        let pergelModule: PergelModule

        const module = (nuxt._pergel.projects[projectName as any] as any)[moduleName as any]

        try {
          const getIndexExt = () => {
            const datas = readdirSync(resolver.resolve(join('runtime', 'modules', moduleName)))
            const indexExt = datas.find(
              file => file.includes('index')
              && !file.includes('.d.'),
            )
            if (!indexExt)
              throw new Error(`Module ${moduleName} does not have index file`)

            return indexExt
          }
          const indexPath = getIndexExt()

          pergelModule = await import(
            resolver.resolve(join('runtime', 'modules', moduleName, indexPath))
          ).then(m => m.default).catch((res) => {
            consola.error(`Module ${moduleName} failed to import`)
            consola.error(res)
          })
        }

        catch (error) {
          consola.error(`Module ${moduleName} failed to import`)
          throw error
        }
        // Throw error if input is not a function
        if (typeof pergelModule !== 'function')
          throw new TypeError(`Nuxt module should be a function: ${pergelModule}`)

        // const resolvedModule = await pergelModule({ nuxt: nuxt })
        const resolvedModule = await pergelModule.call({
          prepare: true,
        } as any, {
          nuxt,
          options: {
            openFolder: true,
          },
          rootOptions: module,
          moduleOptions: {
            dir: {
              module: join(projectName, moduleName),
              project: join(projectName),
              root: nuxt.options.rootDir,
            },
            moduleName: moduleName as ModuleName,
            firstLetterModuleName: moduleName[0].toUpperCase() + moduleName.slice(1),
            firstLetterProjectName: projectName[0].toUpperCase() + projectName.slice(1),
            projectName,
            openFolder: true,
            moduleDir: join(projectName, moduleName),
          },
        })

        if (resolvedModule === false /* setup aborted */
          || resolvedModule === undefined /* setup failed */
          || typeof resolvedModule === 'string' /* setup failed */
        ) {
          consola.error(`Module ${moduleName} failed to setup`)
          continue
        }

        prepareModules[projectName] ??= {}
        prepareModules[projectName as any][moduleName as any] ??= {} as any
        prepareModules[projectName][moduleName].defineModule = pergelModule
        prepareModules[projectName][moduleName].waitModule = await waitModule({
          defineModule: pergelModule,
          nuxt,
          moduleName,
          projectName,
        })
      }
    }
  }
  catch (error) {
    consola.error(error)
  }

  return prepareModules
}

async function waitModule(
  data: {
    defineModule: PergelModule
    nuxt: Nuxt
    moduleName: string
    projectName: string
  },
) {
  const { defineModule, nuxt, moduleName, projectName } = data

  const rootOptions = (nuxt._pergel.rootOptions.projects[projectName] as any)[moduleName as any]

  const _module = await defineModule
  const getMeta = await _module.getMeta?.()

  if (!getMeta)
    throw new Error(`Module ${moduleName} does not have meta`)

  const _waitModule = typeof getMeta?.waitModule === 'function'
    ? await getMeta.waitModule?.(rootOptions)
    : getMeta?.waitModule

  if (_waitModule)
    return _waitModule
}

function smartSortModules(projectName: string, modules: PrepareModules): string[] {
  const sortedModules: string[] = []
  const visited: Set<string> = new Set()
  const visiting: Set<string> = new Set()

  const visitModule = (moduleName: string) => {
    if (visiting.has(moduleName))
      throw new CircularDependencyError(`Circular dependency detected involving module: ${moduleName}`)

    if (!visited.has(moduleName)) {
      visiting.add(moduleName)

      const module = modules[projectName][moduleName]

      if (module && module.waitModule) {
        for (const dependency of module.waitModule)
          visitModule(dependency)
      }

      sortedModules.push(moduleName)
      visited.add(moduleName)
      visiting.delete(moduleName)
    }
  }

  for (const moduleName in modules[projectName])
    visitModule(moduleName)

  return sortedModules
}

export async function setupModules(data: {
  resolver: Resolver
  nuxt: Nuxt
}) {
  const projects = data.nuxt._pergel.rootOptions.projects
  const _projects = projects && Object.values(projects).map(project => Object.keys(project)).flat()

  if (!projects || !(_projects.length > 0))
    return

  const prepareModules = await initModules(data.nuxt, data.resolver)

  for await (const [projectName, _modules] of Object.entries(projects)) {
    const sortedModules = smartSortModules(projectName, prepareModules)

    if (data.nuxt._pergel.debug) {
      consola.info(`Project ${projectName} modules:`)
      consola.info(sortedModules)
    }

    for await (const moduleName of sortedModules) {
      if (!(data.nuxt._pergel.projects[projectName as any] as any)[moduleName]) {
        consola.error(`Module ${moduleName} does not exist in project ${projectName}. Please check your nuxt.config.ts and add ${moduleName} to ${projectName} project`)
        process.exit(1)
      }

      const module = (data.nuxt._pergel.projects[projectName as any] as any)[moduleName as any]
      const moduleSetup = prepareModules[projectName][moduleName]

      const getMeta = typeof moduleSetup.defineModule.getMeta === 'function'
        ? await moduleSetup.defineModule.getMeta()
        : await moduleSetup.defineModule.getMeta

      if (!getMeta)
        throw new Error(`Module ${moduleName} does not have meta`)

      const dependencies = getMeta.dependencies instanceof Function
        ? getMeta.dependencies(module)
        : getMeta.dependencies ?? {}
      const devDependencies = getMeta.devDependencies instanceof Function
        ? getMeta.devDependencies(module)
        : getMeta.devDependencies ?? {}

      if (Object.keys(dependencies).length > 0 || Object.keys(devDependencies).length > 0) {
        generateProjectReadme({
          data: ({ addCommentBlock }) => ({
            ...addCommentBlock('If pergel cli is installed, you can run `pergel install` automatically to install'),
            packageJson: {
              dependencies: `"${Object.entries(dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
              devDependencies: `"${Object.entries(devDependencies).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
            },
          }),
          moduleName,
          nuxt: data.nuxt,
          projectName,
        })
      }

      // Throw error if input is not a function
      if (typeof moduleSetup.defineModule !== 'function')
        throw new TypeError(`Nuxt module should be a function: ${moduleSetup.defineModule}`)

      const resolvedModule = await moduleSetup.defineModule({
        nuxt: data.nuxt,
        options: {
          openFolder: true,
        },
        rootOptions: module,
        moduleOptions: {
          dir: {
            module: join(projectName, moduleName),
            project: join(projectName),
            root: data.nuxt.options.rootDir,
          },
          moduleName: moduleName as ModuleName,
          firstLetterModuleName: moduleName[0].toUpperCase() + moduleName.slice(1),
          firstLetterProjectName: projectName[0].toUpperCase() + projectName.slice(1),
          projectName,
          moduleDir: join(projectName, moduleName),
          openFolder: true,
        },
      })

      if (
        resolvedModule === false /* setup aborted */
        || resolvedModule === undefined /* setup failed */
        || typeof resolvedModule === 'string' /* setup failed */
      ) {
        consola.error(`Module ${
          moduleName
        } failed to setup`)
        return 'continue'
      }
    }
  }

  for (const item of data.nuxt._pergel.contents) {
    if (!item.projectName || !item.moduleName) {
      throw new Error(`Project name or module name is missing in
${JSON.stringify(item).replace(/"/g, '')}
      `)
    }
  }

  generatePergelTemplate({
    nuxt: data.nuxt,
  })
}
