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
    waitModule: ['nodeCron'],
  },
  defaults: {},
  async setup({ nuxt }) {
    const resolver = createResolver(import.meta.url)
    const module = nuxt._pergel._module

    generateModuleRuntimeConfig<SesModuleRuntimeConfig>(nuxt, {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    })

    addServerImportsDir(resolver.resolve('./composables'))
    nuxt._pergel.contents.push({
      moduleName: module.moduleName,
      projectName: module.projectName,
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
