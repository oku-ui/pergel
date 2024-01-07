import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'
import type { CapacitorConfig, IonicInterface, ResolvedIonicInterface } from './types'

// TODO: Ionic dependencies eklenecek
// TODO: Ionic config dosyaları oluşturma
// TODO: Capasitor configleri oluşturdur

export default definePergelModule<IonicInterface, ResolvedIonicInterface>({
  meta: {
    name: 'ionic',
    version: '0.0.1',
    dependencies: {
      '@nuxtjs/ionic': '^0.12.1',
      '@ionic/cli': '7.2.0',
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
    nuxtConfig: {
      modules: ['@nuxtjs/ionic'],
      ssr: false,
    },
  },
  async setup({ nuxt, moduleOptions, options }) {
    console.log('ionic test', options.appName)
    const capacitorConfig = `
    import { CapacitorConfig } from '@capacitor/cli';

      const config: CapacitorConfig = ${JSON.stringify(options.capacitorConfig)}

      export default config;`
    const nuxtConfig = `
      import { CapacitorConfig } from '@capacitor/cli';
  
        const config: CapacitorConfig = ${JSON.stringify(options.capacitorConfig)}
  
        export default config;`
    // env için
    generateModuleRuntimeConfig(nuxt, moduleOptions, {
    })
    if (!existsSync(resolve(moduleOptions.moduleDir, 'nuxt.config.ts'))) {
      writeFileSync(resolve(moduleOptions.moduleDir, 'nuxt.config.ts'), capacitorConfig, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
    if (!existsSync(resolve(moduleOptions.moduleDir, 'capacitor.config.ts'))) {
      writeFileSync(resolve(moduleOptions.moduleDir, 'capacitor.config.ts'), capacitorConfig, {
        mode: 0o777,
        encoding: 'utf8',
      })
    }
  },
})
