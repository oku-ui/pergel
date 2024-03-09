// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // please install 'pnpm install pergel' and change 'pergel/nuxt'
    '../../packages/nuxt/src/module',
  ],
  css: [
    '~/assets/css/tailwind.css',
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
            tailwindcss: {
              aspectRatio: true,
              form: true,
              tailwindcssAnimate: true,
              typography: true,
            },
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
            slugify: true,
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
