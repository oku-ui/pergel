import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import type { H3Event } from 'h3'
import postgres from 'postgres'
import consola from 'consola'
import { sql } from 'drizzle-orm'
import type { PostgresJSOptions } from '../../types'
import { globalContext } from '../../../../composables/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export async function connectPostgresJS(this: PergelGlobalContextOmitModule, params: {
  pgOptions?: PostgresJSOptions
  event?: H3Event
  context?: PergelGlobalContextOmitModule
  drizzleConfig?: Parameters<typeof drizzle>[1]
}) {
  const context = params.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData } = await globalContext({
    moduleName: 'drizzle',
    projectName: context.projectName,
  }, (runtime) => {
    let client: PostgresJsDatabase | undefined

    if (runtime.postgressJS?.url)
      client = drizzle(postgres(runtime.postgressJS?.url, params.pgOptions?.options), params.drizzleConfig)

    else if (process.env.POSTGRES_URL)
      client = drizzle(postgres(process.env.POSTGRES_URL, params.pgOptions?.options), params.drizzleConfig)

    else if (params.pgOptions?.options)
      client = drizzle(postgres(params.pgOptions.options), params.drizzleConfig)

    else
      throw new Error('PostgresJS is not defined')

    return {
      drizzle: {
        postgressJSClient: client,
      },
    }
  }, params.event)

  if (!selectData?.drizzle?.postgressJSClient)
    throw new Error('PostgresJS is not defined')

  selectData.drizzle.postgressJSClient.execute(sql`SELECT 1;`).catch((e) => {
    if (e.code === 'ECONNREFUSED')
      consola.error('PostgresJS is not running, please start postgres and try again')
    else
      consola.error(e)
  })

  return selectData.drizzle.postgressJSClient
}
