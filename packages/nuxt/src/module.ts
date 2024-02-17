import { join } from 'node:path'

import {
  addImportsDir,
  addPlugin,
  addServerHandler,
  addServerImportsDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  logger,
} from '@nuxt/kit'
import { globbySync } from 'globby'

import defu from 'defu'
import type { NuxtConfigLayer } from '@nuxt/schema'
import type slugify from 'slugify'
import { version } from '../package.json'
import { setupDevToolsUI } from './devtools'
import { DEVTOOLS_MODULE_KEY, DEVTOOLS_MODULE_NAME } from './constants'
import { useNitroImports, useNuxtImports } from './runtime/core/utils/useImports'

import { setupPergel } from './runtime/core/setupPergel'
import { generateMergedPackageJson, generateReadmeJson } from './runtime/core/utils/generateYaml'
import { setupModules } from './runtime/core/setupModules'
import type { PergelModuleNames, PergelOptions, ResolvedPergelOptions } from './runtime/core/types/nuxtModule'
import { writeFilePergel } from './runtime/core/utils/writeFilePergel'
import { writeEnvExample } from './utils/writeEnvExample'
import { writeDockerCompose } from './utils/writeDockerCompose'
import { writeVSCode } from './utils/writeVSCode'

export interface ModulePublicRuntimeConfig {
  slugify: {
    extends: {
      [key: string]: any
    }
    default: Parameters<typeof slugify>[1]
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig { }
}

export default defineNuxtModule<PergelOptions>({
  meta: {
    name: DEVTOOLS_MODULE_NAME,
    configKey: DEVTOOLS_MODULE_KEY,
  },
  defaults: {
    esnext: true,
    projects: {

    },
  },
  async setup(options, nuxt) {
    nuxt.options.build.transpile.push(
      '@pergel/nuxt',
    )

    let pergelOptions = {} as PergelOptions
    // const project = nuxt.options._layers[0]
    const layers = nuxt.options._layers

    function getLayerPergel(configLayer: NuxtConfigLayer) {
      const layerInlineOptions = (configLayer.config.modules || []).find(
        (mod): mod is [string, PergelOptions] | undefined =>
          Array.isArray(mod)
          && typeof mod[0] === 'string'
          && [DEVTOOLS_MODULE_NAME, `${DEVTOOLS_MODULE_NAME}-edge`].includes(mod[0]),
      )?.[1]

      // @ts-ignore (TODO: fix this)
      const pergel = typeof (configLayer.config.pergel) === 'object' ? configLayer.config.pergel! : undefined
      if (pergel)
        return defu(pergel ?? {}, layerInlineOptions)

      return layerInlineOptions
    }

    for (const layer of layers) {
      const layerPergel = getLayerPergel(layer)
      if (layerPergel == null)
        continue

      // const configLocation = project.config.rootDir === layer.config.rootDir ? 'project layer' : 'extended layer'

      pergelOptions = defu(options, layerPergel) as PergelOptions
    }

    const _resolver = createResolver(import.meta.url)

    addServerImportsDir(_resolver.resolve('./runtime/composables'))

    // Nitro auto imports
    nuxt.hook('nitro:config', (config) => {
      if (config.imports) {
        config.imports.imports = config.imports.imports || []

        config.imports.imports.push({
          name: 'usePergelContext',
          from: _resolver.resolve('./runtime/server/utils/usePergelContext'),
        })

        config.imports.imports.push({
          name: 'getPergelContextProject',
          from: _resolver.resolve('./runtime/server/utils/getPergelContextProject'),
        })

        config.imports.imports.push({
          name: 'getPergelContextModule',
          from: _resolver.resolve('./runtime/server/utils/getPergelContextModule'),
        })

        config.alias = config.alias || {}

        config.alias['#pergel/usePergelContext'] = _resolver.resolve(
          './runtime/server/utils/usePergelContext',
        )
      }
    })

    addImportsDir(_resolver.resolve('./runtime/composables'))
    addPlugin(_resolver.resolve('./runtime/plugin'))

    await setupPergel({
      options: pergelOptions,
      nuxt,
      resolver: _resolver,
      version,
    })

    async function moduleSetup() {
      const modules = globbySync('./runtime/modules/**/index.@(ts|mjs)', {
        cwd: _resolver.resolve('./'),
        onlyFiles: true,
        deep: 2,
      })

      const modulesResolve: {
        name: PergelModuleNames
        path: string
      }[] = []

      for await (const module of modules) {
        const moduleName = module.replace('./runtime/modules/', '').replace('/index.ts', '').replace('/index.mjs', '')
        modulesResolve.push({
          name: moduleName as PergelModuleNames,
          path: _resolver.resolve(module),
        })
      }

      nuxt._pergel.resolveModules = modulesResolve
    }

    await moduleSetup()

    const { saveNitroImports } = useNitroImports(nuxt)
    const { saveNuxtImports } = useNuxtImports(nuxt)

    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    nuxt.options.vite.optimizeDeps.include.push('@nuxt/devtools-kit/iframe-client')

    if (options.esnext) {
      nuxt.options.vite.build ??= {}
      nuxt.options.vite.build.target = 'esnext'

      nuxt.options.nitro.esbuild ??= {}
      nuxt.options.nitro.esbuild.options ??= {}
      nuxt.options.nitro.esbuild.options.target = 'esnext'
    }

    const isDevToolsEnabled = typeof nuxt.options.devtools === 'boolean'
      ? nuxt.options.devtools
      : nuxt.options.devtools.enabled

    await setupModules({
      nuxt,
    })

    generateReadmeJson({
      nuxt,
    })

    addServerHandler({
      handler: _resolver.resolve('./runtime/serverContext'),
      middleware: true,
    })

    nuxt._pergel.devServerHandler.forEach(({ fn }) => fn())

    for (const project of Object.keys(nuxt._pergel.dts)) {
      const contents = Object.values(nuxt._pergel.dts[project]).map(module => module.template.join('\n\n')).join('\n\n')
      const declareModules = Object.values(nuxt._pergel.dts[project]).map(module => module.declareModules).join('\n\n')
      const _template = addTemplate({
        filename: join('pergel', project, 'module-types.ts'),
        write: true,
        getContents: () => /* ts */`
        ${contents}

        ${declareModules}
        `.trim(),
      })

      nuxt.hooks.hook('prepare:types', ({ references }) => {
        references.push({
          path: _template.dst,
        })
      })

      nuxt.options.alias[`pergel/${project}/moduleTypes`] = _template.dst
      nuxt.options.nitro.alias ??= {}
      nuxt.options.nitro.alias[`pergel/${project}/moduleTypes`] = _template.dst
    }

    if (nuxt.options.dev && isDevToolsEnabled) {
      setupDevToolsUI(options, _resolver.resolve, nuxt)

      logger.success(`${DEVTOOLS_MODULE_NAME} is ready!`)
    }

    useNuxtImports(nuxt, {
      presets: [{
        from: _resolver.resolve('./runtime/core/utils/usePergelRuntime'),
        imports: ['usePergelRuntime'],
      }],
    })

    nuxt.options.alias['#pergel'] = _resolver.resolve('./runtime')

    if (nuxt._pergel.exitPergelFolder) {
      // Auto generate pergel/[projectName].docker-compose.yml
      writeDockerCompose(nuxt)

      // Auto generate pergel/.env.example
      writeEnvExample(nuxt)

      // Auto generate pergel/merged-package.json
      generateMergedPackageJson({
        nuxt,
      })

      writeVSCode(nuxt)
    }

    // functiontemplate
    if (nuxt._pergel.functionTemplates && nuxt._pergel.functionTemplates.length > 0) {
      for await (const template of nuxt._pergel.functionTemplates) {
        const { writeDir, getContents } = template

        const contents = await getContents()
        writeFilePergel(writeDir, contents)
      }
    }

    saveNitroImports()
    saveNuxtImports()
  },
})

declare module '@nuxt/schema' {
  interface Nuxt {
    _pergel: ResolvedPergelOptions
  }
}
