// Pergel Drizzle test Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: 'pergel/test/drizzle/schema/index.ts',
  out: 'pergel/test/drizzle/migrations',
  driver: 'pg',
  dbCredentials: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_URL
    ? {
        connectionString: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_URL,
      }
    : {
        host: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_HOST,
        port: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_PORT,
        database: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_DATABASE,
        username: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_USERNAME,
        password: process.env.NUXT_TEST_DRIZZLE_POSTGRESJS_PASSWORD,
      },
}
