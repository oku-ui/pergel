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
          appName: 'MyApp',
          themeCss: true,
          defaultCss: false,
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
