import defu from 'defu'
import type {
  ModuleDefinition,
  ModuleOptions,
  ModuleSetupReturn,
  NuxtPergel,
  PergelModule,
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

  async function preparationModule(data: { nuxt: NuxtPergel<OptionsT> }) {
    const { nuxt } = data
    const dependencies = module.meta.dependencies instanceof Function ? module.meta.dependencies(data.nuxt._pergel._module.options) : module.meta.dependencies ?? {}
    const devDependencies = module.meta.devDependencies instanceof Function ? module.meta.devDependencies(data.nuxt._pergel._module.options) : module.meta.devDependencies ?? {}

    if (Object.keys(dependencies).length > 0 || Object.keys(devDependencies).length > 0) {
      generateProjectReadme(nuxt, ({ addCommentBlock }) => ({
        ...addCommentBlock('If pergel cli is installed, you can run `pergel install` automatically to install'),
        packageJson: {
          dependencies: `"${Object.entries(dependencies).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
          devDependencies: `"${Object.entries(devDependencies).map(([name, version]) => `${name}@${version}`).join(', ')}"`,
        },
      }))
    }

    if (module.meta.name) {
      nuxt._pergel.activeModules[nuxt._pergel._module.projectName] ??= {}
      nuxt._pergel.activeModules[nuxt._pergel._module.projectName][module.meta.name] ??= {}
    }

    const defaultModule = module.defaults instanceof Function ? module.defaults({ nuxt }) : module.defaults

    const userModuleOptions = (nuxt._pergel.rootOptions.projects[nuxt._pergel._module.projectName] as any)[nuxt._pergel._module.moduleName] ?? {}

    const moduleOptions = defu({
      ...nuxt._pergel._module,
      options: {
        ...userModuleOptions,
      },
    } satisfies NuxtPergel['_pergel']['_module'], {
      // User send S3 module options
      options: {
        ...defaultModule,
      },
    } as NuxtPergel['_pergel']['_module']) as NuxtPergel['_pergel']['_module']

    // TODO: Fix any type
    // @ts-ignore
    nuxt._pergel.projects[nuxt._pergel._module.projectName][nuxt._pergel._module.moduleName].options = moduleOptions.options as any

    // TODO: Fix any type
    nuxt._pergel._module = moduleOptions as any
    nuxt._pergel.activeModules[nuxt._pergel._module.projectName][nuxt._pergel._module.moduleName] = defu(
      nuxt._pergel.activeModules[nuxt._pergel._module.projectName][nuxt._pergel._module.moduleName],
      moduleOptions.options,
    ) as any

    return Promise.resolve(moduleOptions)
  }

  async function normalizedModule(this: any, data: { nuxt: NuxtPergel<OptionsT> }) {
    // Resolve module and options
    await preparationModule({ nuxt: data.nuxt })

    const key = `pergel:${module.meta.configKey}`
    const mark = performance.mark(key)
    const res = await module.setup?.call(null as any, { nuxt: data.nuxt }) ?? {}
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
