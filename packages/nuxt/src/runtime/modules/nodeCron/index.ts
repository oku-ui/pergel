import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'nodeCron',
    version: '0.1.0',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        nodeCron: deps['node-cron'],
      }
    },
    devDependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@types/node-cron': deps['@types/node-cron'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const resolver = createResolver(import.meta.url)

    addServerImportsDir(resolver.resolve('./composables'))

    nuxt._pergel.contents.push({
      moduleName: options.moduleName,
      projectName: options.projectName,
      content: /* ts */`
          function nodeCron() {
            return {
              nitroPlugin: defineNitroPergelNodeCronPlugin
            }
          }
        `,
      resolve: /* ts */`
            nodeCron: nodeCron,
        `,
    })
  },
})
