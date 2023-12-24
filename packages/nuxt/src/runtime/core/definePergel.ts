import defu from 'defu'
import { useNuxt } from '@nuxt/kit'
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

  async function getOptions(inlineOptions: RootOptions, moduleOptions: ResolvedModuleOptions, nuxt: NuxtPergel = useNuxt()) {
    const defaultModule = module.defaults instanceof Function ? module.defaults({ nuxt, rootOptions: inlineOptions, moduleOptions }) : module.defaults

    const rootOptions = (nuxt._pergel.rootOptions.projects[moduleOptions.projectName] as any)[moduleOptions.moduleName] ?? {}
    const _options = defu(rootOptions, defaultModule)

    return Promise.resolve(_options)
  }

  async function normalizedModule(this: any, data: { nuxt: NuxtPergel, rootOptions: RootOptions, moduleOptions: ResolvedModuleOptions }) {
    const options = await getOptions(data.rootOptions, data.moduleOptions, data.nuxt)

    const key = `pergel:${module.meta.configKey}`
    const mark = performance.mark(key)
    if (!this.prepare) {
      // Resolve module and options

      const res = await module.setup?.call(null as any, { nuxt: data.nuxt, options, rootOptions: data.rootOptions, moduleOptions: data.moduleOptions }) ?? {}
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
