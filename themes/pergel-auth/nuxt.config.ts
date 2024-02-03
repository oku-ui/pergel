// https://nuxt.com/docs/api/configuration/nuxt-config
import { join } from 'node:path'
import {
  CurrencyResolver,
  DateTimeResolver,
  JSONResolver,
  NonEmptyStringResolver,
  UUIDResolver,
} from 'graphql-scalars'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '../../packages/nuxt/src/module',
  ],
  css: [
    '~/assets/css/pergel.css',
  ],
  ssr: false,
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
            radixMode: true,
            uuid: true,
            unsearch: true,
          },
        },
        lucia: {
          driver: 'drizzle:postgre',
        },
        graphqlYoga: {
          codegen: {
            server: {
              config({ dir }) {
                return {
                  enumValues: {
                    RoleStatus: `${join(dir.server, 'drizzle-pzg', 'schema', 'user')}#RoleStatus`,
                  },
                  scalars: {
                    DateTime: DateTimeResolver.extensions.codegenScalarType as any,
                    UUID: UUIDResolver.extensions.codegenScalarType as any,
                    JSON: JSONResolver.extensions.codegenScalarType as any,
                    JSONObject: JSONResolver.extensions.codegenScalarType as any,
                    NonEmptyString: NonEmptyStringResolver.extensions.codegenScalarType as any,
                    Currency: CurrencyResolver.extensions.codegenScalarType as any,
                  },
                  enumsAsTypes: true,
                  useTypeImports: true,
                  strictScalars: true,
                }
              },
            },
          },
        },
        drizzle: true,
      },
    },
  },
})
