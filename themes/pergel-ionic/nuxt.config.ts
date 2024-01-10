// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
    '@nuxtjs/tailwindcss',
  ],
  // ssr: false,
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
          appName: 'MyApp',
          themeCss: true,
          defaultCss: false,
        },
        ui: {
          packages: {
            i18n: true,
          },
        },
      },
    },
  },
})
