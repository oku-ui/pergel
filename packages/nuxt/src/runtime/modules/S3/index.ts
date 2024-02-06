import { addServerHandler, addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { S3ModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'S3',
    version: '0.1.0',
    dependencies: {
      '@pergel/module-s3': 'latest',
    },
  },
  defaults: {
    openFolder: false,
  },
  setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<S3ModuleRuntimeConfig>(nuxt, options, {
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
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* TypeScript */ `
          function S3() {
            return {
              client: getPergelContextModule.bind({
                ...ctx,
                moduleName: '${options.moduleName}',
              }),
              use: usePergelS3.bind(ctx),
            }
          }
        `,
      resolve: /* TypeScript */ `
          S3: S3,
        `,
    })
  },
})
