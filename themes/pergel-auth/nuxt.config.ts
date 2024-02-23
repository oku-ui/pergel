// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  css: [
    '~/assets/css/pergel.css',
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
            uuid: true,
            unsearch: true,
            shadcnNuxt: true,
            nanoid: true,
            otpComponent: true,
            neoconfetti: true,
            unovis: true,
            dateFns: true,
            typescript: true,
          },
        },
        ses: true,
        lucia: {
          driver: 'drizzle:postgre',
          oauth: ['github', 'google'],
        },
        graphqlYoga: {
          codegen: {
            server: {
              config({ dir }) {
                return {
                  enumValues: {
                    RoleStatus: dir.drizzleShemas('RoleStatus'),
                  },
                }
              },
            },
          },
        },
        drizzle: true,
        urql: true,
        vitest: true,
      },
    },
  },
})
