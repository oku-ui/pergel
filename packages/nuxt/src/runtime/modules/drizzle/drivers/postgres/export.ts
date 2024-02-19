import { drizzle } from 'drizzle-orm/postgres-js'
import type { H3Event } from 'h3'
import postgres from 'postgres'
import consola from 'consola'
import { sql } from 'drizzle-orm'
import type { PostgresJSOptions } from '../../types'
import { usePergelContext } from '../../../../server/utils/usePergelContext'

import type { PergelGlobalContextOmitModule } from '#pergel/types'

export async function connectPostgresJS(this: PergelGlobalContextOmitModule, params: {
  pgOptions?: PostgresJSOptions
  event: H3Event | false
  context?: PergelGlobalContextOmitModule
  drizzleConfig?: Parameters<typeof drizzle>[1]
}) {
  const context = params.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData } = await usePergelContext<'drizzle'>({
    moduleName: 'drizzle',
    projectName: context.projectName,
  }, (runtime) => {
    let pg: postgres.Sql | undefined

    if (runtime?.url)
      pg = postgres(runtime?.url, params.pgOptions?.options)

    else if (process.env.POSTGRES_URL)
      pg = postgres(process.env.POSTGRES_URL, params.pgOptions?.options)

    else if (params.pgOptions?.options)
      pg = postgres(params.pgOptions.options)

    if (!pg)
      throw new Error('PostgresJS is not defined')

    return {
      drizzle: {
        postgressJSClient: drizzle(pg, params.drizzleConfig),
      },
    }
  }, params.event)

  if (!selectData?.drizzle?.postgressJSClient)
    throw new Error('PostgresJS is not defined')

  selectData.drizzle.postgressJSClient
    .execute(sql`SELECT 1;`)
    .catch((e) => {
      if (e.code === 'ECONNREFUSED')
        consola.error('PostgresJS is not running, please start postgres and try again')
      else
        consola.error(e)
    })

  return selectData.drizzle.postgressJSClient
}
