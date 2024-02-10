import { resolve } from 'pathe'
import { DEVTOOLS_UI_PATH } from '../src/constants'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/devtools-ui-kit',
    // 'radix-vue/nuxt',
    'shadcn-nuxt',
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  app: {
    baseURL: DEVTOOLS_UI_PATH,
  },
})
