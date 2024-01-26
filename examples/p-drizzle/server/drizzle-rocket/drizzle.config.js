// Pergel Drizzle rocket Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: 'server/drizzle-rocket/schema/index.ts',
  out: 'server/drizzle-rocket/migrations',
  driver: 'pg',
  dbCredentials: process.env.NUXT_ROCKET_DRIZZLE_URL
    ? {
        connectionString: process.env.NUXT_ROCKET_DRIZZLE_URL,
      }
    : {
        host: process.env.NUXT_ROCKET_DRIZZLE_HOST,
        port: process.env.NUXT_ROCKET_DRIZZLE_PORT,
        database: process.env.NUXT_ROCKET_DRIZZLE_DATABASE,
        user: process.env.NUXT_ROCKET_DRIZZLE_USER,
        password: process.env.NUXT_ROCKET_DRIZZLE_PASSWORD,
        ssl: process.env.NUXT_ROCKET_DRIZZLE_SSL,
      },
}
