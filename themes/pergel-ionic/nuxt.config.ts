// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'pergel/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pergel: {
    projects: {
      changeName: {
        ionic: {
          themeCss: true,
        },
      },
    },
  },
})
