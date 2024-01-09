// nuxt-module-build prepare fix type
export default defineNuxtConfig({
  modules: ['src/module'],
  devtools: {
    enabled: true,
  },
  plugins: [
    './plugins/settings',
  ],
  pergel: {
    pergelDir: 'pergel',
    debug: true,
    projects: {
      test: {
        S3: true,
        nodeCron: true,
        ses: true,
        bullmq: true,
        json2csv: true,
        graphqlYoga: {
          mergeSchemas: true,
        },
        drizzle: true,
        ui: true,
        ionic: true,
      },
      test2: {
        S3: true,
      },
    },
  },
})
