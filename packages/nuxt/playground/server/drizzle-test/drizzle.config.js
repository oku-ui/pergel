// Pergel Drizzle test Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: 'server/drizzle-test/schema/index.ts',
  out: 'server/drizzle-test/migrations',
  driver: 'pg',
  dbCredentials: process.env.NUXT_TEST_DRIZZLE_URL
    ? {
        connectionString: process.env.NUXT_TEST_DRIZZLE_URL,
      }
    : {
        host: process.env.NUXT_TEST_DRIZZLE_HOST,
        port: process.env.NUXT_TEST_DRIZZLE_PORT,
        database: process.env.NUXT_TEST_DRIZZLE_DATABASE,
        user: process.env.NUXT_TEST_DRIZZLE_USER,
        password: process.env.NUXT_TEST_DRIZZLE_PASSWORD,
        ssl: process.env.NUXT_TEST_DRIZZLE_SSL,
      },
}
