import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'
import type { ModuleOptions } from './moduleType'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'oku-pergel',
    configKey: 'okuPergel',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true,
    test: 'test',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.devtools)
      setupDevToolsUI(options, nuxt, resolver)
  },
})
