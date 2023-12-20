import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import type { H3Event } from 'h3'
import postgres from 'postgres'
import type { PostgresJSOptions } from '../../types'
import { clientFunctionTemplate } from '../../../../core/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

const { clientInit } = clientFunctionTemplate<PostgresJsDatabase, PostgresJSOptions>('drizzle')

export async function connectPostgresJS(this: PergelGlobalContextOmitModule, ctx: {
  options?: PostgresJSOptions
  event?: H3Event
  pergel?: PergelGlobalContextOmitModule
}) {
  const _pergel = ctx.pergel ?? this

  if (!_pergel || !_pergel.projectName)
    throw new Error('Pergel is not defined')

  const { client } = await clientInit(_pergel, (runtime) => {
    if (runtime.url)
      return drizzle(postgres(runtime.url, {}))

    else if (process.env.POSTGRES_URL)
      return drizzle(postgres(process.env.POSTGRES_URL, ctx.options?.options))

    else if (ctx.options?.options)
      return drizzle(postgres(ctx.options.options))

    else
      throw new Error('PostgresJS is not defined')
  }, ctx.event, undefined, 'pg')

  if (!client)
    throw new Error('PostgresJS is not defined')

  return client
}
