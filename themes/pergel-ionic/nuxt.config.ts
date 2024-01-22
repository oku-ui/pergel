// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  ssr: false,
  pergel: {
    projects: {
      changeName: {
        ionic: {
          appId: 'ionic.example.com',
          appName: 'MyApp',
          webDir: 'dist',
          server: {
            url: 'localhost:3000',
          },
          themeCss: true,
          defaultCss: false,
          purchase: true,
        },
        box: {
          packages: {
            i18n: true,
            veeValidate: true,
            zod: true,
            radixVue: true,
            tailwindcss: true,
            nuxtIcon: true,
            colorMode: true,
            notivue: true,
          },
          ionicMode: true,
        },
      },
    },
  },
})
