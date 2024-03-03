import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { CapacitorOptions } from '../capacitor/types'
import type { ResolvedCapacitorOptions } from './types'

// TODO: Ionic dependencies eklenecek
// TODO: Ionic config dosyaları oluşturma
// TODO: Capasitor configleri oluşturdur

export default definePergelModule<CapacitorOptions, ResolvedCapacitorOptions>({
  meta: {
    name: 'capacitor',
    version: '0.0.1',
    dependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@capacitor/core': deps['@capacitor/core'],
      }
    },
    devDependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@capacitor/cli': deps['@capacitor/cli'],
      }
    },
  },
  defaults: {
    capacitorConfig: {
      appName: 'My App',
      appId: 'com.example.app',
      webDir: 'www',
      plugins: {
        SplashScreen: {
          launchShowDuration: 0,
        },
      },
    },
  },
  async setup({ nuxt, options }) {
    const capacitorConfig = `import { type CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = ${JSON.stringify(options.capacitorConfig, null, 2).replace(/"([^"]+)":/g, '$1:')}

export default config;`
    generateModuleRuntimeConfig(nuxt, options, {
    })

    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || []

    if (!existsSync(resolve(nuxt.options.rootDir, 'capacitor.config.ts'))) {
      writeFileSync(resolve(nuxt.options.rootDir, 'capacitor.config.ts'), capacitorConfig, {
        encoding: 'utf8',
      })
    }

    const { projectName, moduleName } = options

    generateProjectReadme({
      data: ({ addCommentBlock }) => ({
        ...addCommentBlock('Script Commands'),
        scripts: {
          'capacitor:init': 'npx cap init',
          'capacitor:sync': 'npx cap sync',
          'capacitor:android': 'npx cap android',
          'capacitor:ios': 'npx cap ios',
          'generate': 'nuxt generate',
        },
        cli: {
          'capacitor:init': `pergel module -c=true -s=capacitor:init -p=${projectName} -m=${moduleName}`,
          'capacitor:sync': `pergel module -c=true -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'capacitor:build:sync': `pergel module -c=true -s=generate -p=${projectName} -m=${moduleName} && pergel module -c=true -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'capacitor:android': `pergel module -c=true -s=capacitor:android -p=${projectName} -m=${moduleName}`,
          'capacitor:ios': `pergel module -c=true -s=capacitor:ios -p=${projectName} -m=${moduleName}`,
          'generate': `pergel module -s=generate -p=${projectName} -m=${moduleName}`,
        },
      }),
      nuxt,
      moduleName,
      projectName,
    })
  },
})
