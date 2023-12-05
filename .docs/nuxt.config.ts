// https://nuxt.com/docs/api/configuration/nuxt-config
import { defu } from 'defu'
import type { NuxtConfig } from 'nuxt/config'

const devConfig = {
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
  ],
  extends: [
    '@nuxt/ui-pro',
  ],
  devtools: { enabled: false },

  routeRules: {
    '/': { redirect: '/pergel' },
  },
} as NuxtConfig

export default defineNuxtConfig(defu({}, process.env.DEV && devConfig, {
  nitro: {
    prerender: {
      routes: [
        '/pergel',
        '/pergel/getting-started',
      ],
    },
  },
} as NuxtConfig))
