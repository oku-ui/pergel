import { join } from 'node:path'
import { cpSync, existsSync } from 'node:fs'
import { definePergelModule } from '../../core/definePergel'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { EslintConfig, ResolvedEslintConfig } from './types'

export default definePergelModule<EslintConfig, ResolvedEslintConfig>({
  meta: {
    name: 'eslint',
    version: '0.1.0',
    devDependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        'eslint': deps.eslint,
        'eslint-plugin-tailwindcss': deps['eslint-plugin-tailwindcss'],
        '@antfu/eslint-config': deps['@antfu/eslint-config'],
        'simple-git-hooks': deps['simple-git-hooks'],
        'lint-staged': deps['lint-staged'],
      }
    },
  },
  defaults: {
  },
  async setup({ nuxt, options }) {
    const { projectName, moduleName } = options

    if (!existsSync(join(nuxt.options.rootDir, 'eslint.config.js')))
      cpSync(join(nuxt._pergel.pergelModuleRoot, 'templates', 'eslint.config.js'), join(nuxt.options.rootDir, 'eslint.config.js'))

    generateProjectReadme({
      nuxt,
      projectName,
      moduleName,
      data() {
        return {
          scripts: {
            'lint': 'eslint .',
            'lint:fix': 'eslint . --fix',
            'prepare': 'npx simple-git-hooks',
          },
          roots: {
            'simple-git-hooks': {
              'pre-commit': 'pnpm lint-staged',
            },
            'lint-staged': {
              '*': 'eslint . --fix',
            },
          },
          vscode: {
            'eslint.experimental.useFlatConfig': true,
          },
        }
      },
    })
  },
})
