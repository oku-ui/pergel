import { existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { globbySync } from 'globby'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { createDockerService } from '../../core/utils/createDockerService'
import { createFolderModule } from '../../core/utils/createFolderModule'
import { writeFilePergel } from '../../core/utils/writeFilePergel'
import { generatorFunctionName } from '../../core/utils/generatorNames'
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

    if (!existsSync(resolve(options.serverDir, 'index.ts'))) {
      const files = globbySync((join(nuxt._pergel.pergelModuleRoot, 'templates', options.moduleName, '**/*')), {
        onlyFiles: true,
      })

      for (const file of files) {
        const readFile = await nuxt._pergel.jitiDyanmicImport(file)
        if (readFile) {
          const fileData = readFile({
            projectName: options.projectName,
            nuxt,
          })
          const fileName = basename(file)

          writeFilePergel(resolve(options.serverDir, fileName), fileData)
        }
      }
    }

    const typeName = generatorFunctionName(options.projectName, 'BullmqContext', {
      type: true,
    })

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function bullmq() {
            return {
              nitroPlugin: (definePergelNitroBullMQPlugin<${typeName}>).bind(ctx),
              useScheduler: (useScheduler<BullmqContext>).bind(ctx),
              context: (getPergelContextModule<'bullmq'>).bind({
                ...ctx,
                moduleName: '${options.moduleName}',
              }),
            }
          }
        `,
      before: [
        `import type { ${typeName} } from ${options.pergelModuleRoot}/types`,
      ],
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
