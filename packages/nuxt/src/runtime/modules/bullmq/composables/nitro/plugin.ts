import type { NitroApp } from 'nitropack'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { useScheduler } from './useScheduler'
import type { Scheduler } from './useScheduler'
import type { PergelGlobalContextOmitModule } from '#pergel'

export function definePergelNitroBullMQPlugin(
  this: PergelGlobalContextOmitModule,
  data: {
    setup: (
      utils: {
        useScheduler: () => Scheduler
      },
      nitroApp: NitroApp) => void
    pergel?: PergelGlobalContextOmitModule
  },
) {
  return defineNitroPlugin(async (nitro) => {
    data.setup({
      useScheduler: () => useScheduler.call({
        ...data.pergel || this,
        nitro,
      }),
    }, nitro)
  })
}
