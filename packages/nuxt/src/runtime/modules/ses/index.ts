import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { SesModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'ses',
    version: '0.1.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@aws-sdk/client-ses': deps['@aws-sdk/client-ses'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)
    generateModuleRuntimeConfig<SesModuleRuntimeConfig>(nuxt, options, {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    })

    addServerImportsDir(resolver.resolve('./composables'))
    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
        function ses() {
          return {
            use: usePergelSES.bind(ctx),
            client: (getPergelContextModule<'ses'>).bind({
              ...ctx,
              moduleName: '${options.moduleName}',
            }),
          }
        }
          `,
      resolve: /* ts */`
        ses: ses,
          `,
    })
  },
})
