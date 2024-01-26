import { Redis } from 'ioredis'
import type { RedisOptions } from 'ioredis'
import type { H3Event } from 'h3'

import { globalContext } from '#imports'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export async function useBullMQRedisClient(
  this: PergelGlobalContextOmitModule,
  params: {
    options: RedisOptions
    context?: PergelGlobalContextOmitModule
    event: H3Event | false
  },
) {
  const context = params.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel BullMQ is not defined')

  const { selectData } = await globalContext<'bullmq'>({
    projectName: context.projectName,
    moduleName: 'bullmq',
  }, (runtime) => {
    if (!runtime?.url && (!runtime?.options || !runtime?.options.host || runtime?.options.port === 0))
      throw new Error('No BullMQ found in environment variables.')

    if (runtime?.url) {
      return {
        bullmq: {
          client: new Redis(runtime.url, {
            maxRetriesPerRequest: null,
          }),
        },
      }
    }

    if (!runtime?.options)
      throw new Error('No BullMQ found in environment variables.')

    return {
      bullmq: {
        client: new Redis({
          host: runtime.options.host || 'localhost',
          port: runtime.options.port || 6379,
          password: runtime.options.password || undefined,
          username: runtime.options.username || undefined,
          db: runtime.options.db || 0,
          maxRetriesPerRequest: null,
          ...params.options,
        }),
      },
    }
  }, params.event)

  if (!selectData?.bullmq?.client)
    throw new Error('No BullMQ found in environment variables.')

  return selectData.bullmq.client
}
