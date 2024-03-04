import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { logger as _logger } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig, generateModuleRuntimeConfigEnv } from '../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { CapacitorModuleRuntimeConfig, CapacitorOptions } from '../capacitor/types'
import type { ResolvedCapacitorOptions } from './types'

export default definePergelModule<CapacitorOptions, ResolvedCapacitorOptions>({
  meta: {
    name: 'capacitor',
    version: '0.0.1',
    dependencies(options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      const defaultDeps = {
        '@capacitor/core': deps['@capacitor/core'],
        '@capacitor/ios': deps['@capacitor/ios'],
        '@capacitor/android': deps['@capacitor/android'],
      } as Record<string, string>

      if (options.plugins.official) {
        if (options.plugins.official.actionSheet)
          defaultDeps['@capacitor/action-sheet'] = deps['@capacitor/action-sheet']
      }

      if (options.plugins.community) {
        if (options.plugins.community.revenuecat)
          defaultDeps['@revenuecat/purchases-capacitor'] = deps['@revenuecat/purchases-capacitor']
      }

      return {
        ...defaultDeps,
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
    plugins: {
      official: {
        actionSheet: false,
      },
      community: {
        revenuecat: false,
      },
    },
  },
  async setup({ nuxt, options }) {
    generateModuleRuntimeConfigEnv(nuxt, options, {
      runTargetAndroidEmulator: undefined,
      runTargetIOSSimulator: undefined,
      runScheme: undefined,
    })

    const envData = generateModuleRuntimeConfig<CapacitorModuleRuntimeConfig>(nuxt, options, {
      runTargetIOSSimulator: undefined,
      runTargetAndroidEmulator: undefined,
      runScheme: undefined,
    }, true)

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

    if (options.ios && !existsSync(resolve(nuxt.options.rootDir, 'ios'))) {
      execSync(
          `pnpm pergel module -s=capacitor:add:ios -p=${projectName} -m=${moduleName}`,
          {
            stdio: 'inherit',
            cwd: nuxt.options.rootDir,
          },
      )
      _logger.info(`iOS platform added to ${projectName}`)
    }

    if (options.android && !existsSync(resolve(nuxt.options.rootDir, 'android'))) {
      execSync(
          `pnpm pergel module -s=capacitor:add:android -p=${projectName} -m=${moduleName}`,
          {
            stdio: 'inherit',
            cwd: nuxt.options.rootDir,
          },
      )
      _logger.info(`Android platform added to ${projectName}`)
    }

    generateProjectReadme({
      data: ({ addCommentBlock }) => ({
        ...addCommentBlock('Script Commands'),
        scripts: {
          'capacitor:init': 'cap init',
          'capacitor:sync': 'cap sync',
          'capacitor:update': 'cap update',
          'capacitor:ls': 'cap ls',
          'capacitor:copy': 'cap copy',
          'capacitor:add:android': 'cap add android',
          'capacitor:add:ios': 'cap add ios',
          'generate': 'nuxt generate',
          'capacitor:open:android': 'cap open android',
          'capacitor:open:ios': 'cap open ios',
          'capacitor:ios:list': 'cap run ios --list',
          'capacitor:android:list': 'cap run android --list',
          'run:ios:device': `cap run ios --target=${envData.runtimeConfig?.runTargetIOSSimulator}`,
          'run:android:device': `cap run android --target=${envData.runtimeConfig?.runTargetAndroidEmulator}`,
        },
        cli: {
          'init': `pergel module -s=capacitor:init -p=${projectName} -m=${moduleName}`,
          'sync': `pergel module -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'build:sync': `pergel module -s=generate -p=${projectName} -m=${moduleName} && pergel module -s=capacitor:sync -p=${projectName} -m=${moduleName}`,
          'add:android': `pergel module -s=capacitor:android -p=${projectName} -m=${moduleName}`,
          'add:ios': `pergel module -s=capacitor:ios -p=${projectName} -m=${moduleName}`,
          'generate': `pergel module -s=generate -p=${projectName} -m=${moduleName}`,
          'open:android': `pergel module -s=capacitor:open:android -p=${projectName} -m=${moduleName}`,
          'open:ios': `pergel module -s=capacitor:open:ios -p=${projectName} -m=${moduleName}`,
          'list:ios': `pergel module -s=capacitor:ios:list -p=${projectName} -m=${moduleName}`,
          'list:android': `pergel module -s=capacitor:android:list -p=${projectName} -m=${moduleName}`,
          'run:ios:device': `pergel module -s=run:ios:device -p=${projectName} -m=${moduleName}`,
          'run:android:device': `pergel module -s=run:android:device -p=${projectName} -m=${moduleName}`,
          'update': `pergel module -s=capacitor:update -p=${projectName} -m=${moduleName}`,
          'copy': `pergel module -s=capacitor:copy -p=${projectName} -m=${moduleName}`,
          'ls': `pergel module -s=capacitor:ls -p=${projectName} -m=${moduleName}`,
        },
      }),
      nuxt,
      moduleName,
      projectName,
    })
  },
})
