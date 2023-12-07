// https://nuxt.com/docs/api/configuration/nuxt-config
import { defu } from 'defu'
import type { NuxtConfig } from 'nuxt/config'

const routeRules = {
  '/pergel/getting-started': { redirect: '/pergel/getting-started/introduction', prerender: false },
  '/pergel/community': { redirect: '/pergel/community/getting-help', prerender: false },
  '/pergel/examples': { redirect: '/pergel/examples/overview', prerender: false },
  '/pergel/directory-structure': { redirect: '/pergel/directory-structure/projectname', prerender: false },
  '/pergel/nuxt/s3': { redirect: '/pergel/nuxt/s3/installation', prerender: false },
}

const devConfig = {
  $development: {
    runtimeConfig: {
      public: {
        website: {
          url: 'http://localhost:3000',
        },
      },
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    'nuxt-og-image',
  ],
  extends: [
    '@nuxt/ui-pro',
  ],
  devtools: { enabled: false },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },
  routeRules: {
    '/': { redirect: '/pergel' },
    ...routeRules,
  },
  ogImage: {
    defaults: {
      extension: 'png',
    },
  },
  tailwindcss: {
    viewer: false,
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },

} as NuxtConfig

export default defineNuxtConfig(defu({}, process.env.DEV && devConfig, {
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: [
        '/pergel/*',
        '/pergel',
      ],
    },
  },
  routeRules: {
    ...routeRules,
  },
} as NuxtConfig))
