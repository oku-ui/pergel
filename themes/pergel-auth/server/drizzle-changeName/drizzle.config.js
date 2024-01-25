// Pergel Drizzle changeName Config - oku-ui.com/pergel

/** @type { import("drizzle-kit").Config } */
export default {
  schema: 'server/drizzle-changeName/schema/index.ts',
  out: 'server/drizzle-changeName/migrations',
  driver: 'pg',
  dbCredentials: process.env.NUXT_CHANGE_NAME_DRIZZLE_URL
    ? {
        connectionString: process.env.NUXT_CHANGE_NAME_DRIZZLE_URL,
      }
    : {
        host: process.env.NUXT_CHANGE_NAME_DRIZZLE_HOST,
        port: process.env.NUXT_CHANGE_NAME_DRIZZLE_PORT,
        database: process.env.NUXT_CHANGE_NAME_DRIZZLE_DATABASE,
        user: process.env.NUXT_CHANGE_NAME_DRIZZLE_USER,
        password: process.env.NUXT_CHANGE_NAME_DRIZZLE_PASSWORD,
        ssl: process.env.NUXT_CHANGE_NAME_DRIZZLE_SSL,
      },
}
