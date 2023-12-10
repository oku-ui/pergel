import {
  createResolver,
  defineNuxtModule,
  logger,
} from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

import type { ImportsOptions } from '@nuxt/schema'
import type { UnimportPluginOptions } from 'unimport/unplugin'

import { version } from '../package.json'
import { setupDevToolsUI } from './core/devtools'
import { DEVTOOLS_MODULE_KEY, DEVTOOLS_MODULE_NAME } from './core/constants'
import type { PergelOptions } from './core/types/module'
import { checkOptions } from './core/utils/checkOptions'

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

    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    nuxt.options.vite.optimizeDeps.include.push('@nuxt/devtools-kit/iframe-client')

    // Pergel _pergel default options
    nuxt._pergel = {
      nitroImports: {},
      nuxtImports: {},
      readmeYaml: {
        pergel: {
          'comment-block-1': 'This file is generated by pergel. Do not edit it manually.',
          'comment-block-2': `Version: ${version}`,
        },
      },
      modules: [
        'S3',
      ],
      resolver: _resolver,
    }

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

    if (nuxt.options.dev && isDevToolsEnabled) {
      setupDevToolsUI(options, _resolver.resolve, nuxt)

      logger.success(`${DEVTOOLS_MODULE_NAME} is ready!`)
    }
  },
})

declare module '@nuxt/schema' {
  interface Nuxt {
    _pergel: {
      nitroImports: Partial<UnimportPluginOptions>
      nuxtImports: Partial<ImportsOptions>
      readmeYaml: Record<string, any>
      modules: string[]
      resolver: Resolver
    }
  }
}
