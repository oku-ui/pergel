import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { SesModuleRuntimeConfig } from './types'

export default definePergelModule({
  meta: {
    name: 'ses',
    version: '0.0.1',
    dependencies: {
      '@aws-sdk/client-ses': '^3.470.0',
    },
  },
  defaults: {
    openFolder: false,
  },
  async setup({ nuxt, moduleOptions }) {
    const resolver = createResolver(import.meta.url)

    generateModuleRuntimeConfig<SesModuleRuntimeConfig>(nuxt, moduleOptions, {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    })

    addServerImportsDir(resolver.resolve('./composables'))
    nuxt._pergel.contents.push({
      moduleName: moduleOptions.moduleName,
      projectName: moduleOptions.projectName,
      content: /* ts */`
        function ses() {
          return {
            use: usePergelSES.bind(ctx),
          }
        }
          `,
      resolve: /* ts */`
        ses: ses,
          `,
    })
  },
})
