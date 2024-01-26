import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'nodeCron',
    version: '0.0.1',
    dependencies: {
      'node-cron': '^3.0.3',
    },
    devDependencies: {
      '@types/node-cron': '^3.0.11',
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
