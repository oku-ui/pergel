import { join } from 'node:path'
import type { Nuxt } from '@nuxt/schema'
import { camelCase } from 'scule'
import consola from 'consola'
import { generatePergelTemplate } from './utils/generatePergelTemplate'
import { generateProjectReadme } from './utils/generateYaml'
import type { PergelModule } from './types/module'
import type { PergelModuleNames, ResolvedPergelOptions } from './types/nuxtModule'

const logger = consola.create({
  defaults: {
    tag: 'pergel',
  },
})

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

async function initModules(nuxt: Nuxt) {
  const projects = nuxt._pergel.rootOptions.projects

  const prepareModules: PrepareModules = {}

  try {
    for await (const [projectName, modules] of Object.entries(projects)) {
      for await (const [moduleName, moduleValue] of Object.entries(modules)) {
        if (typeof moduleValue === 'boolean' && moduleValue === false)
          continue

        if (
          (typeof moduleValue === 'object' && moduleValue === null)
          || (typeof moduleValue === 'object' && !moduleValue)
        ) {
          continue
        }

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
          const modulePath = nuxt._pergel.resolveModules.find(
            module => module.name === moduleName,
          )

          if (!modulePath)
            throw new Error(`Module ${moduleName} does not exist`)

          pergelModule = await import(modulePath.path).then(m => m.default).catch((res) => {
            logger.error(`Module ${moduleName} failed to import`)
            logger.error(res)
          })
        }

        catch (error) {
          logger.error(`Module ${moduleName} failed to import`)
          throw error
        }
        // Throw error if input is not a function
        if (typeof pergelModule !== 'function')
          throw new TypeError(`Nuxt module should be a function: ${pergelModule}`)

        const serverFrom = join(camelCase(projectName), 'server', camelCase(moduleName))
        const clientFrom = join(camelCase(projectName), 'client', camelCase(moduleName))
        const rootModuleDir = join(nuxt._pergel.pergelDir, `${moduleName}-${projectName}`)
        const serverDir = join(nuxt._pergel.serverDir, `${moduleName}-${projectName}`)

        const resolvedModule = await pergelModule.call({
          prepare: true,
        } as any, {
          nuxt,
          options: {
            _dir: {
              module: join(camelCase(projectName), camelCase(moduleName)),
              server: join(nuxt._pergel.dir.server, `${moduleName}-${projectName}`),
              build: join('.nuxt', 'pergel', projectName, moduleName),
            },
            moduleName: moduleName as PergelModuleNames,
            projectName,
            rootModuleDir,
            serverDir,
            projectNameCamelCase: camelCase(projectName, { normalize: true }),
            projectNameCamelCaseWithPergel: camelCase(`pergel-${projectName}`, { normalize: true }),
            folderName: `${camelCase(moduleName)}-${camelCase(projectName)}`,
            buildDir: join(nuxt.options.buildDir, 'pergel', projectName, moduleName),
          },
          rootOptions: module,
        })

        nuxt.options.alias[`#${serverFrom}`] = join(serverDir)
        nuxt.options.nitro.alias ??= {}
        nuxt.options.nitro.alias[`#${serverFrom}`] = join(serverDir)

        nuxt.options.alias[`#${clientFrom}`] = join(rootModuleDir)
        nuxt.options.nitro.alias ??= {}
        nuxt.options.nitro.alias[`#${clientFrom}`] = join(rootModuleDir)

        if (resolvedModule === false /* setup aborted */
          || resolvedModule === undefined /* setup failed */
          || typeof resolvedModule === 'string' /* setup failed */
        ) {
          logger.error(`Module ${moduleName} failed to setup`)
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
    logger.error(error)
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
  nuxt: Nuxt
}) {
  const projects = data.nuxt._pergel.rootOptions.projects
  const _projects = projects && Object.values(projects).map(project => Object.keys(project)).flat()

  if (!projects || !(_projects.length > 0))
    return

  const prepareModules = await initModules(data.nuxt)

  for await (const [projectName, _modules] of Object.entries(projects)) {
    const sortedModules = smartSortModules(projectName, prepareModules)

    if (data.nuxt._pergel.debug) {
      logger.info(`Project ${projectName} modules:`)
      logger.info(sortedModules)
    }

    for await (const moduleName of sortedModules) {
      if (!(data.nuxt._pergel.projects[projectName as any] as any)[moduleName]) {
        logger.error(`Module ${moduleName} does not exist in project ${projectName}. Please check your nuxt.config.ts and add ${moduleName} to ${projectName} project`)
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
        ? getMeta.dependencies(module, data.nuxt)
        : getMeta.dependencies ?? {}
      const devDependencies = getMeta.devDependencies instanceof Function
        ? getMeta.devDependencies(module, data.nuxt)
        : getMeta.devDependencies ?? {}

      const patches = getMeta.patches instanceof Function
        ? getMeta.patches(module, data.nuxt)
        : getMeta.patches ?? {}

      if (Object.keys(dependencies).length > 0 || Object.keys(devDependencies).length > 0) {
        generateProjectReadme({
          data: ({ addCommentBlock }) => ({
            ...addCommentBlock('If pergel cli is installed, you can run `pergel install` automatically to install'),
            packageJson: {
              dependencies: {
                ...dependencies,
              },
              devDependencies: {
                ...devDependencies,
              },
              patches: {
                pnpm: {
                  patchedDependencies: {
                    ...patches.pnpm?.patchedDependencies,
                  },
                },
              },
            },
          }),
          moduleName,
          nuxt: data.nuxt,
          projectName,
        })
      }

      if (process.env.PERGEL_SETUP === 'true') {
        logger.info(`Creating packages ${moduleName} for project ${projectName}`)
        continue
      }

      // Throw error if input is not a function
      if (typeof moduleSetup.defineModule !== 'function')
        throw new TypeError(`Nuxt module should be a function: ${moduleSetup.defineModule}`)

      const resolvedModule = await moduleSetup.defineModule({
        nuxt: data.nuxt,
        options: {
          _dir: {
            module: join(projectName, moduleName),
            server: join(data.nuxt._pergel.serverDir, `${moduleName}-${projectName}`),
            build: join('.nuxt', 'pergel', projectName, moduleName),
          },
          moduleName: moduleName as PergelModuleNames,
          projectName,
          rootModuleDir: join(data.nuxt._pergel.pergelDir, `${moduleName}-${projectName}`),
          serverDir: join(data.nuxt._pergel.serverDir, `${moduleName}-${projectName}`),
          projectNameCamelCase: camelCase(projectName, { normalize: true }),
          projectNameCamelCaseWithPergel: camelCase(`pergel-${projectName}`, { normalize: true }),
          folderName: `${camelCase(moduleName)}-${camelCase(projectName)}`,
          buildDir: join(data.nuxt.options.buildDir, 'pergel', projectName, moduleName),
        },
        rootOptions: module,
      })

      if (
        resolvedModule === false /* setup aborted */
        || resolvedModule === undefined /* setup failed */
        || typeof resolvedModule === 'string' /* setup failed */
      ) {
        logger.error(`Module ${
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
