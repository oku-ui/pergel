import { addServerHandler, addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { S3ModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'S3',
    version: '0.2.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@pergel/module-s3': deps['@pergel/module-s3'],
      }
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
              context: (getPergelContextModule<'s3'>).bind({
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
