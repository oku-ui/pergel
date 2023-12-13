import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'json2csv',
    version: '0.0.1',
    dependencies: {
      '@json2csv/node': '^7.0.4',
    },
  },
  defaults: {},
  async setup(options) {
    const resolver = createResolver(import.meta.url)
    const projectName = options.resolvedModule.projectName

    addServerImportsDir(resolver.resolve('./composables'))

    options._contents.push({
      moduleName: 'json2csv',
      projectName,
      content: /* ts */`
          function json2csv() {
            return {
              use: useNitroJson2CSV,
            }
          }
        `,
      resolve: /* ts */`
            json2csv: json2csv,
        `,
    })
  },
})
