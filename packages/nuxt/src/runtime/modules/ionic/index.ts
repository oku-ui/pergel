import { existsSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { installModule } from '@nuxt/kit'
import type { ModuleOptions } from '@nuxtjs/ionic'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { IonicInterface, ResolvedIonicInterface } from './types'

// TODO: Ionic dependencies eklenecek
// TODO: Ionic config dosyaları oluşturma
// TODO: Capasitor configleri oluşturdur

export default definePergelModule<IonicInterface, ResolvedIonicInterface>({
  meta: {
    name: 'ionic',
    version: '0.0.1',
    dependencies: {
      '@nuxtjs/ionic': '^0.13.0',
      '@ionic/cli': '^7.2.0',
      '@ionic/core': '^7.6.3',
      '@capacitor/cli': '^5.6.0',
    },
  },
  defaults: {
    appName: 'TestIonic',
    capacitorConfig: {
      appId: 'com.company.appname',
      appName: 'My Capacitor App',
      webDir: 'www',
    },
    defaultCss: false,
    themeCss: false,
  },
  async setup({ nuxt, moduleOptions, options }) {
    console.log('ionic test', options.appName)
    const capacitorConfig = `
    import { CapacitorConfig } from '@capacitor/cli';

      const config: CapacitorConfig = ${JSON.stringify(options.capacitorConfig)}

      export default config;`
    // const nuxtConfig = `
    // export default defineNuxtConfig({
    //   ${JSON.stringify(options.nuxtConfig)}
    // })`
    // env için
    generateModuleRuntimeConfig(nuxt, moduleOptions, {
    })

    // TODO: add docs
    if (options.defaultCss)
      nuxt.options.css.push(join(nuxt.options.rootDir, 'assets/css/ionic.css'))

    if (options.themeCss) {
      nuxt.options.css.push(join(nuxt.options.rootDir, 'assets/themes/dark.css'))
      nuxt.options.css.push(join(nuxt.options.rootDir, 'assets/themes/default.css'))
    }

    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || []
    nuxt.options.vite.optimizeDeps.include.push('@ionic/vue')

    await installModule('@nuxtjs/ionic', {
      integrations: {
        //
        icons: false,
      },
      css: {
        utilities: true,
        //
      },
      config: {

        //
      },

    } satisfies ModuleOptions)

    if (!existsSync(resolve(moduleOptions.moduleDir, 'capacitor.config.ts'))) {
      writeFileSync(resolve(moduleOptions.moduleDir, 'capacitor.config.ts'), capacitorConfig, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
    //     ionic config set -g npmClient pnpm
    // ionic integrations enable capacitor
    // ionic capacitor add ios
    // ionic capacitor add android

    const { projectName, moduleName } = moduleOptions

    generateProjectReadme({
      data: ({ addCommentBlock }) => ({
        ...addCommentBlock('Script Commands'),
        scripts: {
          'enable:capacitor': 'ionic config set -g npmClient pnpm & ionic integrations enable capacitor',
          'create:ios': 'ionic capacitor add ios',
          'create:android': 'ionic capacitor add android',
        },
        cli: {
          'enable:capacitor': `pergel module -s=enable:capacitor -p=${projectName} -m=${moduleName}`,
          'create:ios': `pergel module -s=create:ios -p=${projectName} -m=${moduleName}`,
          'create:android': `pergel module -s=create:android -p=${projectName} -m=${moduleName}`,
        },
      }),
      nuxt,
      moduleName,
      projectName,
    })
  },
})
