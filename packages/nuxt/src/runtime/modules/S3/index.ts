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
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<S3ModuleRuntimeConfig>(nuxt, options, {
      region: 'auto',
      endpoint: '',
      accessKeyId: '',
      secretAccessKey: '',
      bucket: '',
    })

    const projectName = options.resolvedModule.projectName

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

    options._contents.push({
      moduleName: 'S3',
      projectName,
      content: /* TypeScript */ `
          function S3() {
            return {
              client: pergelS3Client.bind(ctx),
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
