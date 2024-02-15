import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { definePergelModule } from '../../core/definePergel'
import { generateProjectReadme } from '../../core/utils/generateYaml'

export default definePergelModule({
  meta: {
    name: 'vitest',
    version: '0.0.1',
    devDependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@nuxt/test-utils': deps['@nuxt/test-utils'],
        'vitest': deps.vitest,
        '@vue/test-utils': deps['@vue/test-utils'],
        'happy-dom': deps['happy-dom'],
        'playwright-core': deps['playwright-core'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const { projectName, moduleName } = options

    if (!existsSync(join(nuxt.options.rootDir, 'vitest.config.ts')))
      cpSync(join(nuxt._pergel.pergelModuleRoot, 'templates', 'vitest.config.ts'), join(nuxt.options.rootDir, 'vitest.config.ts'))

    generateProjectReadme({
      nuxt,
      projectName,
      moduleName,
      data() {
        return {
          scripts: {
            'test': 'vitest',
            'test:watch': 'vitest --watch',
          },
        }
      },
    })
  },
})
