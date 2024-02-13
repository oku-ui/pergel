import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { addModuleDTS } from '../../core/utils/addModuleDTS'
import { createDockerService } from '../../core/utils/createDockerService'
import { createFolderModule } from '../../core/utils/createFolderModule'
import type { BullMQModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'bullmq',
    version: '0.1.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        'bullmq': deps.bullmq,
        'ioredis': deps.ioredis,
        'p-timeout': deps['p-timeout'],
      }
    },
    dts: true,
  },
  defaults({ nuxt, options }) {
    createFolderModule({
      nuxt,
      serverDir: options._dir.server,
      moduleName: options.moduleName,
      projectName: options.projectName,
    })

    return {
      ...options,
    }
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<BullMQModuleRuntimeConfig>(nuxt, options, {
      options: {
        host: 'localhost',
        port: 6379,
        db: 0,
        password: 'redis',
        username: 'default',
      },
      url: 'redis://default:redis@localhost:6379/0',
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
      dir: options.serverDir,
    })

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function bullmq() {
            return {
              nitroPlugin: (definePergelNitroBullMQPlugin<BullmqContext>).bind(ctx),
              useScheduler: (useScheduler<BullmqContext>).bind(ctx),
              client: (getPergelContextModule<'bullmq'>).bind({
                ...ctx,
                moduleName: '${options.moduleName}',
              }),
            }
          }
        `,
      resolve: /* ts */`
            bullmq: bullmq,
        `,
    })

    createDockerService(nuxt, options.projectName, {
      services: {
        redis: {
          image: 'redis:alpine',
          restart: 'always',
          ports: [
            '6379:6379',
          ],
          volumes: [
            'redis:/data',
          ],
          command: [
            'redis-server',
            '--appendonly yes',
            '--requirepass redis',
          ],
        },
      },
      volumes: {
        redis: {
          driver: 'local',
        },
      },
    })
  },
})
