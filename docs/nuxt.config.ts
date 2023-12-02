// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
  ],
  extends: [
    '@nuxt/ui-pro',
  ],
  devtools: { enabled: false },

  typescript: {
    strict: false,
    includeWorkspace: false,
    tsConfig: {
      extends: '../tsconfig.json',
    },
  },
  routeRules: {
    '/': { redirect: '/pergel' },
  },
})
