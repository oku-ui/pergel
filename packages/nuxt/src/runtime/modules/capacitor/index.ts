import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { logger as _logger } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { CapacitorOptions } from '../capacitor/types'
import type { ResolvedCapacitorOptions } from './types'

export default definePergelModule<CapacitorOptions, ResolvedCapacitorOptions>({
  meta: {
    name: 'capacitor',
    version: '0.0.1',
    dependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@capacitor/core': deps['@capacitor/core'],
        '@capacitor/ios': deps['@capacitor/ios'],
        '@capacitor/android': deps['@capacitor/android'],
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
      webDir: 'dist',
      plugins: {
        SplashScreen: {
          launchShowDuration: 0,
        },
      },
    },
    ios: false,
    android: false,
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

    switch (true) {
      case options.ios:
        if (existsSync(resolve(nuxt.options.rootDir, 'ios')))
          break

        execSync(
          `pnpm pergel module -s=capacitor:add:ios -p=${projectName} -m=${moduleName}`,
          {
            stdio: 'inherit',
            cwd: nuxt.options.rootDir,
          },
        )
        _logger.info(`iOS platform added to ${projectName}`)
        break
      case options.android:
        if (existsSync(resolve(nuxt.options.rootDir, 'android')))
          break

        execSync(
          `pnpm pergel module -s=capacitor:add:android -p=${projectName} -m=${moduleName}`,
          {
            stdio: 'inherit',
            cwd: nuxt.options.rootDir,
          },
        )
        _logger.info(`Android platform added to ${projectName}`)
        break
      default:
        break
    }

    generateProjectReadme({
      data: ({ addCommentBlock }) => ({
        ...addCommentBlock('Script Commands'),
        scripts: {
          'capacitor:init': 'cap init',
          'capacitor:sync': 'cap sync',
          'capacitor:add:android': 'cap add android',
          'capacitor:add:ios': 'cap add ios',
          'generate': 'nuxt generate',
        },
        cli: {
          'init': `pergel module -s=capacitor:init -p=${projectName} -m=${moduleName}`,
          'sync': `pergel module -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'build:sync': `pergel module -s=generate -p=${projectName} -m=${moduleName} && pergel module -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'add:android': `pergel module -s=capacitor:android -p=${projectName} -m=${moduleName}`,
          'add:ios': `pergel module -s=capacitor:ios -p=${projectName} -m=${moduleName}`,
          'generate': `pergel module -s=generate -p=${projectName} -m=${moduleName}`,
        },
      }),
      nuxt,
      moduleName,
      projectName,
    })
  },
})
