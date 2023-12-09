import { existsSync } from 'node:fs'
import type { Nuxt } from 'nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { ModuleOptions } from './moduleType'
import type { ClientFunctions, ServerFunctions } from './rpc-types'

const DEVTOOLS_UI_ROUTE = '/__oku-pergel'
const DEVTOOLS_UI_LOCAL_PORT = 3300
export const RPC_NAMESPACE = 'oku-pergel-rpc'

export function setupDevToolsUI(options: ModuleOptions, nuxt: Nuxt, resolver: Resolver) {
  const clientPath = resolver.resolve('./client')
  const isProductionBuild = existsSync(clientPath)
  // Serve production-built client (used when package is published)
  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  // In local development, start a separate Nuxt Server and proxy to serve the client
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: `http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, ''),
      }
    })
  }

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      // unique identifier
      name: 'oku-pergel',
      // title to display in the tab
      title: 'Pergel',
      // any icon from Iconify, or a URL to an image
      icon: 'carbon:apps',
      // iframe view
      view: {
        type: 'iframe',
        src: DEVTOOLS_UI_ROUTE,
      },
    })
  })

  // wait for DevTools to be initialized
  onDevToolsInitialized(async () => {
    const rpc = extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
      // register server RPC functions
      getMyModuleOptions() {
        return options
      },
    })

    // // call client RPC functions
    // // since it might have multiple clients connected, we use `broadcast` to call all of them
    await rpc.broadcast.showNotification('Hello from My Module!')
  })
}
