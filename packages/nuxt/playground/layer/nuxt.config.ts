export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  pergel: {
    projects: {
      test: {
        box: {
          packages: {
            neoconfetti: true,
            colorMode: true,
            i18n: true,
            tailwindcss: true,
            vueUse: true,
            veeValidate: true,
            notivue: true,
            nuxtIcon: true,
            pinia: true,
            zod: true,
          },
        },
      },

    },
  },
})
