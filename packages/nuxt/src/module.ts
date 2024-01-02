import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import {
  addTemplate,
  createResolver,
  defineNuxtModule,
  logger,
} from '@nuxt/kit'
import YAML from 'yaml'

import { version } from '../package.json'
import { setupDevToolsUI } from './devtools'
import { DEVTOOLS_MODULE_KEY, DEVTOOLS_MODULE_NAME } from './constants'
import type { PergelOptions, ResolvedPergelOptions } from './runtime/core/types/module'
import { checkOptions } from './runtime/core/utils/checkOptions'
import { useNitroImports, useNuxtImports } from './runtime/core/utils/useImports'
import { setupPergel } from './runtime/core/setupPergel'
import { generateReadmeYaml } from './runtime/core/utils/generateYaml'
import { setupModules } from './runtime/core/setupModules'

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
    const _resolver = createResolver(import.meta.url)

    const { status } = await checkOptions(options)
    if (!status)
      return

    await setupPergel({
      options,
      nuxt,
      resolver: _resolver,
      version,
    })

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
      resolver: _resolver,
    })

    saveNitroImports()
    saveNuxtImports()

    generateReadmeYaml({
      nuxt,
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

    // Docker compose
    const specYaml = YAML.stringify(
      JSON.parse(JSON.stringify(nuxt._pergel.composeTemplates)),
    )

    writeFileSync(join(nuxt.options.rootDir, 'pergel', 'docker-compose.yaml'), specYaml, {
      encoding: 'utf8',
    })
  },
})

declare module '@nuxt/schema' {
  interface Nuxt {
    _pergel: ResolvedPergelOptions
  }
}
