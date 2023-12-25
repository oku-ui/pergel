import { addServerHandler, addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { S3ModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'S3',
    version: '0.0.1',
    dependencies: {
      '@pergel/module-s3': '0.0.0',
    },
  },
  setup({ nuxt, moduleOptions }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<S3ModuleRuntimeConfig>(nuxt, moduleOptions, {
      region: 'auto',
      endpoint: '',
      accessKeyId: '',
      secretAccessKey: '',
      bucket: '',
    })

    addServerImportsDir(resolver.resolve('./composables'))

    if (nuxt.options.dev) {
      if (!nuxt._pergel.devServerHandler.find(({ id }) => id === 'S3')) {
        nuxt._pergel.devServerHandler.push({
          id: 'S3',
          fn: () => addServerHandler({
            lazy: true,
            route: '/__pergel__S3/:projectName',
            handler: resolver.resolve('./server/s3'),
          }),
        })
      }
    }

    nuxt._pergel.contents.push({
      moduleName: moduleOptions.moduleName,
      projectName: moduleOptions.projectName,
      content: /* TypeScript */ `
          function S3() {
            return {
              // TODO: change name to 'usePergelS3Client'
              client: pergelS3Client.bind(ctx),
              // TODO: change name to 'usePergelS3'
              // TODO: useS3 key name change -> 'use'
              useS3: useS3.bind(ctx),
            }
          }
        `,
      resolve: /* TypeScript */ `
          S3: S3,
        `,
    })
  },
})
