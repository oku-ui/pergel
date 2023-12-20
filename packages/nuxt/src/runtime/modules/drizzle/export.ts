import { connectPostgresJS } from './drivers/postgres/export'

export function drizzleDriver() {
  return {
    driver() {
      return {
        postgresjs() {
          return {
            connect: connectPostgresJS,
          }
        },
      }
    },
  }
}
