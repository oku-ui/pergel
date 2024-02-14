import { definePergelModule } from '../../core/definePergel'
import type { EslintYogaConfig, ResolvedEslintYogaConfig } from './types'

export default definePergelModule<EslintYogaConfig, ResolvedEslintYogaConfig>({
  meta: {
    name: 'eslint',
    version: '0.0.1',
    dependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        'eslint': deps.eslint,
        'eslint-plugin-tailwindcss': deps['eslint-plugin-tailwindcss'],
        '@antfu/eslint-config': deps['@antfu/eslint-config'],
      }
    },
  },
  defaults: {
  },
  async setup() {

  },
})
