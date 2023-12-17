import { existsSync } from 'node:fs'
import type { Resolver } from '@nuxt/kit'
import {
  extendServerRpc,
  onDevToolsInitialized,
} from '@nuxt/devtools-kit'
import type {
  ClientFunctions,
  NuxtPergel,
  PergelOptions,
  ServerFunctions,
} from './runtime/core/types'

import { setupRPC } from './rpc'
import {
  DEVTOOLS_MODULE_ICON,
  DEVTOOLS_MODULE_NAME,
  DEVTOOLS_MODULE_TITLE,
  DEVTOOLS_RPC_NAMESPACE,
  DEVTOOLS_UI_PATH,
  DEVTOOLS_UI_PORT,
} from './constants'
import { useViteWebSocket } from './useViteWebSocket'

export function setupDevToolsUI(
  options: PergelOptions,
  resolve: Resolver['resolve'],
  nuxt: NuxtPergel,
) {
  const clientPath = resolve('./client')
  const isProductionBuild = existsSync(clientPath)

  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_PATH,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_PATH] = {
        target: `http://localhost:${DEVTOOLS_UI_PORT}${DEVTOOLS_UI_PATH}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_PATH, ''),
      }
    })
  }

  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      name: DEVTOOLS_MODULE_NAME,
      title: DEVTOOLS_MODULE_TITLE,
      icon: DEVTOOLS_MODULE_ICON,
      view: {
        type: 'iframe',
        src: DEVTOOLS_UI_PATH,
      },
    })
  })

  const wsServer = useViteWebSocket(nuxt)
  onDevToolsInitialized(async () => {
    const rpcFunctions = setupRPC({ options, wsServer, nuxt })

    extendServerRpc<ClientFunctions, ServerFunctions>(DEVTOOLS_RPC_NAMESPACE, rpcFunctions)
  })
}
