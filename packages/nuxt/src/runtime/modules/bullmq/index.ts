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
  },
  defaults: {},
  async setup(options, nuxt) {
    const projectName = options.resolvedModule.projectName

    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<BullMQModuleRuntimeConfig>(nuxt, options, {
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
  queueName: 'default'
      `,
      options,
      nuxt,
    })

    options._contents.push({
      moduleName: options.resolvedModule.name,
      projectName,
      content: /* ts */`
          function bullmq<NitroPlugin extends object>() {
            return {
              nitroPlugin: (definePergelNitroBullMQPlugin<NitroPlugin>).bind(ctx),
              useScheduler: (useScheduler<NitroPlugin>).bind(ctx),
            }
          }
        `,
      resolve: /* ts */`
            bullmq: bullmq,
        `,
    })
  },
})
