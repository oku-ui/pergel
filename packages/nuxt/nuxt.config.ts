// nuxt-module-build prepare fix type
export default defineNuxtConfig({
  modules: ['src/module'],
  devtools: true,
  pergel: {
    pergelDir: 'pergel',
    rootDir: 'playground',
    projects: {
      test: {
        S3: true,
      },
    },
  },

})
