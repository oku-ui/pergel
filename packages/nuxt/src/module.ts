import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { BirpcGroup } from 'birpc'
import { setupDevToolsUI } from './devtools'
import type { ModuleOptions } from './moduleType'
import type { ClientFunctions, ServerFunctions } from './rpc-types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pergel',
    configKey: 'pergel',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true,
    test: 'test',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    let rpc: BirpcGroup<ClientFunctions, ServerFunctions> | undefined
    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)

      const RPC_NAMESPACE = 'pergel-rpc'

      const setupRpc = () => {
        rpc = extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
          // register server RPC functions
          getMyModuleOptions() {
            return options
          },
        })
      }

      try {
        setupRpc()
      }
      catch (error) {
        // wait for DevTools to be initialized
        onDevToolsInitialized(async () => {
          setupRpc()
        })
      }
      await rpc?.broadcast.showNotification('Hello from Nuxt module!')
    }
  },
})
