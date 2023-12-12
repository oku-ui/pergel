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
  defaults: {},
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const projectName = options.resolvedModule.projectName

    generateModuleRuntimeConfig<SesModuleRuntimeConfig>(nuxt, options, {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    })

    addServerImportsDir(resolver.resolve('./composables'))

    options._contents.push({
      moduleName: 'ses',
      projectName,
      content: /* ts */`
        function ses() {
          return {
            useSes: useSes.bind(ctx),
          }
        }
          `,
      resolve: /* ts */`
        ses: ses,
          `,
    })
  },
})
