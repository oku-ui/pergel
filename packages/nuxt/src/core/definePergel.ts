import type { ModuleOptions, Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type {
  ModuleDefinition,
  ModuleSetupReturn,
  PergelModule,
  ResolvedPergelOptions,
} from './types'
import { generateProjectReadme } from './utils/generateYaml'

export function definePergelModule<OptionsT extends ModuleOptions>(
  definition: ModuleDefinition<OptionsT> | PergelModule<OptionsT>,
): PergelModule<OptionsT> {
  if (typeof definition === 'function')
    return definePergelModule({ setup: definition })

  // Normalize definition and meta
  const module: ModuleDefinition<OptionsT> & Required<Pick<ModuleDefinition<OptionsT>, 'meta'>> = defu(definition, { meta: {} })

  if (module.meta.configKey === undefined)
    module.meta.configKey = module.meta.name

  async function getOptions(nuxt: Nuxt, options: ResolvedPergelOptions) {
    const dependencies = module.meta.dependencies ?? {}

    if (Object.keys(dependencies).length > 0) {
      generateProjectReadme(nuxt, options, ({ addCommentBlock }) => ({
        ...addCommentBlock('If pergel cli is installed, you can run `pergel install` automatically to install'),
        packageJson: {
          dependencies: `"${Object.entries(dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
          devDependencies: `"${Object.entries(module.meta.devDependencies ?? {}).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
        },
      }))
    }

    const defaultModule = module.defaults instanceof Function ? module.defaults(nuxt, options) : module.defaults

    const userModuleOptions = (options.rootOptions.projects[options.resolvedModule.projectName] as any)[options.resolvedModule.name] ?? {}

    const moduleOptions = defu({
      ...options,
      // Example S3 module default options
      moduleOptions: {
        ...userModuleOptions,
      },
    }, {
      // User send S3 module options
      moduleOptions: {
        ...defaultModule,
      },
    } as ResolvedPergelOptions<OptionsT>) as ResolvedPergelOptions<OptionsT>

    return Promise.resolve(moduleOptions)
  }

  async function normalizedModule(this: any, pergelOptions: ResolvedPergelOptions, nuxt: Nuxt) {
    // Resolve module and options
    const options = await getOptions(nuxt, pergelOptions)

    const key = `pergel:${module.meta.configKey}`
    const mark = performance.mark(key)
    const res = await module.setup?.call(null as any, options, nuxt) ?? {}
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

  return normalizedModule as PergelModule<OptionsT>
}
