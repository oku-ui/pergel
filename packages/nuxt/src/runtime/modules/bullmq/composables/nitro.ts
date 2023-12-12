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
        useScheduler: (queueName: string, prefix?: string) => Scheduler
      },
      nitroApp: NitroApp) => void
    pergel?: PergelGlobalContextOmitModule
  },
) {
  return defineNitroPlugin(async (_nitro) => {
    console.warn('Redis plugin started', this)
    data.setup({
      useScheduler: (queueName, prefix) => useScheduler.call(data.pergel || this, {
        queueName,
        prefix: prefix || 'nitro',
      }),
    }, _nitro)
  })
}
