// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pergel/nuxt',
  ],
  devtools: { enabled: true },
  pergel: {
    text: 'Hello World!',
  },
})
