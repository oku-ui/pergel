// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pergel/nuxt',
  ],
  ssr: false,
  pergel: {
    projects: {
      changeName: {
        ionic: {
          defaultCss: true,
        },
      },
    },
  },
})
