// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  pergel: {
    projects: {
      changeName: {
        box: {
          packages: {
            colorMode: true,
            i18n: true,
            zod: true,
            veeValidate: true,
            vueUse: true,
            notivue: true,
            tailwindcss: true,
            nuxtIcon: true,
            radixVue: true,
          },
        },
        drizzle: true,
        lucia: true,
      },
    },
  },
})
