// Pergel Drizzle rocket Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: 'pergel/rocket/drizzle/schema/index.ts',
  out: 'pergel/rocket/drizzle/migrations',
  driver: 'pg',
  dbCredentials: process.env.NUXT_ROCKET_DRIZZLE_PG_URL
    ? {
        connectionString: process.env.NUXT_ROCKET_DRIZZLE_PG_URL,
      }
    : {
        host: process.env.NUXT_ROCKET_DRIZZLE_PG_HOST,
        port: process.env.NUXT_ROCKET_DRIZZLE_PG_PORT,
        database: process.env.NUXT_ROCKET_DRIZZLE_PG_DATABASE,
        user: process.env.NUXT_ROCKET_DRIZZLE_PG_USER,
        password: process.env.NUXT_ROCKET_DRIZZLE_PG_PASSWORD,
        ssl: process.env.NUXT_ROCKET_DRIZZLE_PG_SSL,
      },
}
