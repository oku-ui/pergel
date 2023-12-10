// nuxt-module-build prepare fix type
export default defineNuxtConfig({
  modules: ['src/module'],
  devtools: true,
  pergel: {
    pergelDir: 'pergel',
    rootDir: 'playground',
    projects: {
      project1: {
        S3: true,
      },
    },
  },

})
