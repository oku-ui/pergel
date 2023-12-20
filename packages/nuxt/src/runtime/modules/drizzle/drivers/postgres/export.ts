import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import type { H3Event } from 'h3'
import postgres from 'postgres'
import type { PostgresJSOptions } from '../../types'
import type { PergelGlobalContextOmitModule } from '#pergel/types'
import { clientFunctionTemplate } from '~/src/runtime/core/useClient'

const { clientInit } = clientFunctionTemplate<PostgresJsDatabase, PostgresJSOptions>('drizzle')

export async function connectPostgresJS(ctx: {
  pergel: PergelGlobalContextOmitModule
  options: PostgresJSOptions
  event?: H3Event
}) {
  const { client } = await clientInit(ctx.pergel, (runtime) => {
    if (runtime.url)
      return drizzle(postgres(runtime.url, {}))

    else if (process.env.POSTGRES_URL)
      return drizzle(postgres(process.env.POSTGRES_URL, ctx.options.options))

    else if (ctx.options.options)
      return drizzle(postgres(ctx.options.options))

    else
      throw new Error('PostgresJS is not defined')
  }, ctx.event)

  if (!client)
    throw new Error('PostgresJS is not defined')

  return client
}
