import type { WebSocketServer } from 'vite'
import type { NuxtPergel } from './runtime/core/types/nuxtModule'

export function useViteWebSocket(nuxt: NuxtPergel) {
  return new Promise<WebSocketServer>((_resolve) => {
    nuxt.hooks.hook('vite:serverCreated', (viteServer) => {
      _resolve(viteServer.ws)
    })
  })
}
