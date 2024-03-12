import postgres from 'postgres'
import consola from 'consola'
import type { PostgresJSOptions } from '../../types'
import { usePergelContext } from '../../../../server/utils/usePergelContext'

import type { PergelGlobalContextOmitModule } from '#pergel/types'

export async function postgresJSClient(this: PergelGlobalContextOmitModule, params: {
  pgOptions?: PostgresJSOptions
  context?: PergelGlobalContextOmitModule
}): Promise<ReturnType<typeof postgres>> {
  const context = params.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData } = usePergelContext<'drizzle'>({
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
        postgressJSClient: pg,
      },
    }
  })

  if (!selectData?.drizzle?.postgressJSClient)
    throw new Error('PostgresJS is not defined')

  try {
    await selectData.drizzle.postgressJSClient`
    SELECT 1;
  `
  }
  catch (error) {
    consola.error(error, 'PostgresJS is not running, please start postgres and try again')
  }

  return selectData.drizzle.postgressJSClient
}
