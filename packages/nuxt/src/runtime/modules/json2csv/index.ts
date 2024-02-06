import { addImportsDir, addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'json2csv',
    version: '0.1.10',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@json2csv/node': deps['@json2csv/node'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    addServerImportsDir(resolver.resolve('./composables/server'))
    addImportsDir(resolver.resolve('./composables/vue'))

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
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
