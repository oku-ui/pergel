import {
  createResolver,
  defineNuxtModule,
  logger,
} from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import { DEVTOOLS_MODULE_KEY, DEVTOOLS_MODULE_NAME } from './constants'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: DEVTOOLS_MODULE_NAME,
    configKey: DEVTOOLS_MODULE_KEY,
  },
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const isDevToolsEnabled = typeof nuxt.options.devtools === 'boolean'
      ? nuxt.options.devtools
      : nuxt.options.devtools.enabled

    if (nuxt.options.dev && isDevToolsEnabled)
      setupDevToolsUI(options, resolve, nuxt)

    logger.success(`${DEVTOOLS_MODULE_NAME} is ready!`)
  },
})
