// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  pergel: {
    projects: {
      changeName: {
        ui: true,
        drizzle: true,
        lucia: true,
      },
    },
  },
})
