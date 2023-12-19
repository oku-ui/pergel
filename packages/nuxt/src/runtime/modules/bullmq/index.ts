import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { addModuleDTS } from '../../core/utils/addModuleDTS'
import type { BullMQModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'bullmq',
    version: '0.0.1',
    dependencies: {
      'bullmq': '^4.14.3',
      'ioredis': '^5.3.2',
      'p-timeout': '^6.1.2',
    },
    dts: true,
  },
  defaults: {},
  async setup({ nuxt }) {
    const options = nuxt._pergel._module

    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<BullMQModuleRuntimeConfig>(nuxt, {
      options: {
        host: '',
        port: 6379,
        db: 0,
        password: '',
        username: '',
      },
      url: '',
    })

    addServerImportsDir(resolver.resolve('./composables/nitro'))

    addModuleDTS({
      template: /* ts */`
export interface BullmqContext {
  queueName: 'default' | 'email'
}
      `,
      nuxt,
      moduleName: options.moduleName,
      projectName: options.projectName,
      interfaceNames: ['BullmqContext'],
    })

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function bullmq() {
            return {
              nitroPlugin: (definePergelNitroBullMQPlugin<BullmqContext>).bind(ctx),
              useScheduler: (useScheduler<BullmqContext>).bind(ctx),
            }
          }
        `,
      resolve: /* ts */`
            bullmq: bullmq,
        `,
    })
  },
})
