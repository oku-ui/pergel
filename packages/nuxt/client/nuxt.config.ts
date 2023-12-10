import { resolve } from 'pathe'
import { DEVTOOLS_UI_PATH } from '../src/core/constants'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/devtools-ui-kit',
  ],
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
  app: {
    baseURL: DEVTOOLS_UI_PATH,
  },
})
