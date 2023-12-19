import type { NitroApp } from 'nitropack'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { useScheduler } from './useScheduler'
import type { Scheduler } from './useScheduler'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export function definePergelNitroBullMQPlugin<T extends object>(
  this: PergelGlobalContextOmitModule,
  data: {
    setup: (
      utils: {
        useScheduler: () => Scheduler<T>
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
      }) as Scheduler<T>,

    }, nitro)
  })
}
