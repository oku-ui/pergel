import { join } from 'node:path'
import { installModule } from '@nuxt/kit'
import type { ModuleOptions } from '@nuxtjs/ionic'
import { definePergelModule } from '../../core/definePergel'
import { generateProjectReadme } from '../../core/utils/generateYaml'
import type { IonicInterface, ResolvedIonicInterface } from './types'

// TODO: Ionic dependencies eklenecek
// TODO: Ionic config dosyaları oluşturma
// TODO: Capasitor configleri oluşturdur

export default definePergelModule<IonicInterface, ResolvedIonicInterface>({
  meta: {
    name: 'ionic',
    version: '0.0.1',
    dependencies(_options, nuxt) {
      const deps = nuxt._pergel.pergelPackageJson
      return {
        '@nuxtjs/ionic': deps['@nuxtjs/ionic'],
        '@ionic/cli': deps['@ionic/cli'],
        '@ionic/core': deps['@ionic/core'],
      }
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
  async setup({ nuxt, options }) {
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

    const { projectName, moduleName } = options

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
