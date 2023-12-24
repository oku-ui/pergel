import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import consola from 'consola'
import type { ModuleName, PergelModule } from './types'
import { generatePergelTemplate } from './utils/generatePergelTemplate'
import { generateProjectReadme } from './utils/generateYaml'

class CircularDependencyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CircularDependencyError'
  }
}

export async function setupModules(data: {
  resolver: Resolver
  nuxt: Nuxt
}) {
  const projects = data.nuxt._pergel.rootOptions.projects
  const modules = projects && Object.values(projects).map(project => Object.keys(project)).flat()
  if (!projects || !(modules.length > 0))
    return

  const prepareModules: {
    [project: string]: {
      [module: string]: {
        defineModule: PergelModule
      }
    }
  } = {}

  try {
    for await (const [projectName, modules] of Object.entries(projects)) {
      for await (const [moduleName, moduleValue] of Object.entries(modules)) {
        if (typeof moduleValue === 'boolean' && moduleValue === false)
          continue

        if (
          (typeof moduleValue === 'object' && moduleValue === null)
          || (typeof moduleValue === 'object' && !moduleValue)
        )
          continue

        if (typeof moduleValue === 'string' && moduleValue === '')
          continue

        data.nuxt._pergel.projects[projectName] ??= {} as any
        (data.nuxt._pergel.projects[projectName] as any)[moduleName] = {
          projectDir: join(data.nuxt._pergel.pergelDir, projectName),
          moduleDir: join(data.nuxt._pergel.pergelDir, projectName, moduleName),
          dir: {
            project: join(data.nuxt._pergel.dir.pergel, projectName),
            module: join(data.nuxt._pergel.dir.pergel, projectName, moduleName),
            root: join(data.nuxt._pergel.dir.pergel),
          },
        }

        data.nuxt._pergel._module = {
          ...(data.nuxt._pergel.projects[projectName] as any)[moduleName],
          projectName,
          moduleName,
        }

        let pergelModule: PergelModule

        try {
          const getIndexExt = () => {
            const datas = readdirSync(data.resolver.resolve(join('runtime', 'modules', moduleName)))
            const indexExt = datas.find(file => file.includes('index') && !file.includes('.d.'))
            if (!indexExt)
              throw new Error(`Module ${moduleName} does not have index file`)

            return indexExt
          }
          const indexPath = getIndexExt()

          pergelModule = await import(
            data.resolver.resolve(join('runtime', 'modules', moduleName, indexPath))
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

        // const resolvedModule = await pergelModule({ nuxt: data.nuxt })
        const resolvedModule = await pergelModule.call({
          prepare: true,
        } as any, {
          nuxt: data.nuxt,
          options: {},
          rootOptions: (data.nuxt._pergel.rootOptions.projects[projectName as any] as any)[moduleName as keyof ModuleName],
        })

        if (resolvedModule === false /* setup aborted */ || resolvedModule === undefined /* setup failed */ || typeof resolvedModule === 'string' /* setup failed */) {
          consola.error(`Module ${moduleName} failed to setup`)
          return 'continue'
        }

        prepareModules[projectName] ??= {}
        prepareModules[projectName as any][moduleName as any] ??= {} as any
        prepareModules[projectName][moduleName].defineModule = pergelModule
      }
    }
  }
  catch (error) {
    consola.error(error)
  }

  async function waitModule(moduleName: string, projectName: string) {
    const moduleSetup = prepareModules[projectName][moduleName]
    const rootOptions = (data.nuxt._pergel.rootOptions.projects[projectName] as any)[moduleName as any]
    const getMeta = typeof moduleSetup.defineModule.getMeta === 'function' ? await moduleSetup.defineModule.getMeta() : await moduleSetup.defineModule.getMeta

    if (!getMeta)
      throw new Error(`Module ${moduleName} does not have meta`)

    const _waitModule = typeof getMeta?.waitModule === 'function' ? await getMeta.waitModule(rootOptions) : getMeta?.waitModule

    if (_waitModule)
      return _waitModule
  }

  const reorderModules = async (
    modules: typeof prepareModules[string],
    projectName: string = '',
  ) => {
    const sortedModules: string[] = []
    const visited: Set<string> = new Set()
    const visiting: Set<string> = new Set()

    const visitModule = async (moduleName: string) => {
      if (visiting.has(moduleName))
        throw new CircularDependencyError(`Circular dependency detected involving module: ${moduleName} in project: ${projectName}`)

      if (!visited.has(moduleName)) {
        visiting.add(moduleName)

        const module = modules[moduleName]
        const _waitModule = await waitModule(moduleName, projectName)

        if (module && _waitModule) {
          for (const dependency of _waitModule)
            visitModule(dependency)
        }

        sortedModules.push(moduleName)
        visited.add(moduleName)
        visiting.delete(moduleName)
      }
    }

    for (const moduleName in modules)
      visitModule(moduleName)

    return sortedModules
  }

  const sortedModules: {
    [project: string]: string[] | string
  } = {}
  try {
    for (const [projectName, modules] of Object.entries(prepareModules)) {
      const result = await reorderModules(modules, projectName)
      if (typeof result === 'string')
        throw new Error(result)

      sortedModules[projectName] = result
    }
  }
  catch (error) {
    consola.error(error)
  }

  for (const [projectName, modules] of Object.entries(sortedModules)) {
    for (const moduleName of modules) {
      const module = (data.nuxt._pergel.projects[projectName as any] as any)[moduleName as any]
      const moduleSetup = prepareModules[projectName][moduleName]

      const getMeta = typeof moduleSetup.defineModule.getMeta === 'function' ? await moduleSetup.defineModule.getMeta() : await moduleSetup.defineModule.getMeta

      if (!getMeta)
        throw new Error(`Module ${moduleName} does not have meta`)

      const dependencies = getMeta.dependencies instanceof Function ? getMeta.dependencies(module._module.options) : getMeta.dependencies ?? {}
      const devDependencies = getMeta.devDependencies instanceof Function ? getMeta.devDependencies(module._module.options) : getMeta.devDependencies ?? {}

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
        options: {},
        rootOptions: (data.nuxt._pergel.rootOptions.projects[projectName as any] as any)[moduleName as keyof ModuleName],
      })

      if (resolvedModule === false /* setup aborted */ || resolvedModule === undefined /* setup failed */ || typeof resolvedModule === 'string' /* setup failed */) {
        consola.error(`Module ${moduleName} failed to setup`)
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
