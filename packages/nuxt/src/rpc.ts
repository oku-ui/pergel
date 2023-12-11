import type { DevtoolsServerContext, ServerFunctions } from './runtime/core/types'

export function setupRPC(ctx: DevtoolsServerContext): ServerFunctions {
  return {
    getOptions() {
      return ctx.options
    },
    async reset() {
      const ws = await ctx.wsServer
      ws.send('nuxt-pergel:reset')
    },
  }
}
