// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pergel/nuxt',
  ],
  pergel: {
    projects: {
      rocket: {
        json2csv: true,
      },
    },
  },
})
