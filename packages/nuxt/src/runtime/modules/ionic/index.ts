import { addServerImportsDir, createResolver } from '@nuxt/kit'
import { definePergelModule } from '../../core/definePergel'
import { generateModuleRuntimeConfig } from '../../core/utils/moduleRuntimeConfig'

// TODO: Ionic dependencies eklenecek
// TODO: Ionic config dosyaları oluşturma
// TODO: Capasitor configleri oluşturdur
export interface IonicInterface {
  appName: string
}
export interface ResolvedIonicInterface {
  appName: string
}
export default definePergelModule<IonicInterface, ResolvedIonicInterface>({
  meta: {
    name: 'ionic',
    version: '0.0.1',
    dependencies: {
    },
  },
  defaults: { appName: 'TestIonic' },
  async setup({ nuxt, moduleOptions, options }) {
    console.log('ionic test', options.appName)

    // env için
    generateModuleRuntimeConfig(nuxt, moduleOptions, {
    })
  },
})
