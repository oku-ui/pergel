import { definePergelModule } from '../../core/definePergel'

export default definePergelModule({
  meta: {
    name: 'vitest',
    version: '0.0.1',
    dependencies(options, nuxt) {
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
  async setup() {
    // await installModule('@nuxt/test-utils/module')
  },
})
