import { resolve } from 'node:path'
import defu from 'defu'
import { useNuxt } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
import consola from 'consola'
import type {
  ModuleDefinition,
  ModuleOptions,
  ModuleSetupReturn,
  NuxtPergel,
  PergelModule,
  ResolvedModuleOptions,
} from './types'

export function definePergelModule<RootOptions extends ModuleOptions = ModuleOptions, ResolvedOptions extends ModuleOptions = ModuleOptions>(
  definition: ModuleDefinition<RootOptions, ResolvedOptions> | PergelModule<RootOptions, ResolvedOptions>,
): PergelModule<RootOptions, ResolvedOptions> {
  if (typeof definition === 'function')
    return definePergelModule({ setup: definition })

  // Normalize definition and meta
  const module: ModuleDefinition<RootOptions, ResolvedOptions> & Required<Pick<ModuleDefinition<RootOptions, ResolvedOptions>, 'meta'>> = defu(definition, { meta: {} })

  if (module.meta.configKey === undefined)
    module.meta.configKey = module.meta.name

  async function getOptions(
    rootOptions: RootOptions,
    resolvedOptions: ResolvedOptions & ResolvedModuleOptions,
    nuxt: NuxtPergel = useNuxt(),
  ) {
    const defaultModule = module.defaults instanceof Function ? module.defaults({ nuxt, options: resolvedOptions, rootOptions }) : module.defaults

    const projectName = resolvedOptions.projectName
    const moduleName = resolvedOptions.moduleName

    const _rootOptions = (nuxt._pergel.rootOptions.projects[projectName] as any)[moduleName] ?? {}

    const _options = defu(_rootOptions, {
      ...resolvedOptions,
      ...defaultModule,
    })

    // TODO: Type this
    // @ts-ignore
    nuxt._pergel.projects[projectName][moduleName] = _options

    return Promise.resolve(_options)
  }

  async function normalizedModule(
    this: any,
    data: { nuxt: NuxtPergel, rootOptions: RootOptions, options: ResolvedOptions & ResolvedModuleOptions },
  ) {
    const options = await getOptions(data.rootOptions, data.options, data.nuxt) as ResolvedModuleOptions

    const key = `pergel:${module.meta.configKey}`
    const mark = performance.mark(key)

    const packageExists = {
      dependencies: 0,
      devDependencies: 0,
    }
    for (const key in module.meta.dependencies) {
      if (!isPackageExists(key)) {
        this.prepare = true
        packageExists.dependencies++
      }
    }

    for (const key in module.meta.devDependencies) {
      if (!isPackageExists(key)) {
        this.prepare = true
        packageExists.devDependencies++
      }
    }

    if (packageExists.dependencies > 0)
      consola.warn(`${packageExists.dependencies} dependencies required for the module are not uploaded at the moment. Run "pergel install" after the settings are finished."`)
    if (packageExists.devDependencies > 0)
      consola.warn(`${packageExists.devDependencies} devDependencies required for the module are not uploaded at the moment. Run "pergel install" after the settings are finished."`)

    if (!this.prepare) {
      // Resolve module and options

      const res = await module.setup?.call(null as any, { nuxt: data.nuxt, options: (options as any), rootOptions: data.rootOptions }) ?? {}
      const perf = performance.measure(key, mark)
      const setupTime = perf ? Math.round(perf.duration * 100) / 100 : 0

      // Check if module is ignored
      if (res === false)
        return false

      // Return module install result
      return defu(res, <ModuleSetupReturn>{
        timings: {
          setup: setupTime,
        },
      })
    }

    const res = {}
    const perf = performance.measure(key, mark)
    const setupTime = perf ? Math.round(perf.duration * 100) / 100 : 0
    // Return module install result
    return defu(res, <ModuleSetupReturn>{
      timings: {
        setup: setupTime,
      },
    })
  }

  normalizedModule.getMeta = () => Promise.resolve(module.meta) as any
  normalizedModule.getOptions = getOptions as any

  return normalizedModule
}
