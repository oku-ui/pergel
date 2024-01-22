import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import type { H3Event } from 'h3'
import postgres from 'postgres'
import consola from 'consola'
import { sql } from 'drizzle-orm'
import type { PostgresJSOptions } from '../../types'
import { clientFunctionTemplate } from '../../../../core/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

const { clientInit } = clientFunctionTemplate<PostgresJsDatabase, PostgresJSOptions>('drizzle')

export async function connectPostgresJS(this: PergelGlobalContextOmitModule, ctx: {
  options?: PostgresJSOptions
  event?: H3Event
  pergel?: PergelGlobalContextOmitModule
  config?: Parameters<typeof drizzle>[1]
}) {
  const _pergel = ctx.pergel ?? this

  if (!_pergel || !_pergel.projectName)
    throw new Error('Pergel is not defined')

  const { client } = await clientInit(_pergel, (runtime) => {
    if (runtime.url)
      return drizzle(postgres(runtime.url, {}), ctx.config)

    else if (process.env.POSTGRES_URL)
      return drizzle(postgres(process.env.POSTGRES_URL, ctx.options?.options), ctx.config)

    else if (ctx.options?.options)
      return drizzle(postgres(ctx.options.options), ctx.config)

    else
      throw new Error('PostgresJS is not defined')
  }, ctx.event, undefined, 'pg')

  if (!client)
    throw new Error('PostgresJS is not defined')

  client.execute(sql`SELECT 1;`).catch((e) => {
    if (e.code === 'ECONNREFUSED')
      consola.error('PostgresJS is not running, please start postgres and try again')
    else
      consola.error(e)
  })

  return client
}
