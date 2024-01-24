import { Redis } from 'ioredis'
import type { RedisOptions } from 'ioredis'

import { globalContext } from '../../../../composables/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export async function useBullMQRedisClient(
  this: PergelGlobalContextOmitModule,
  params: {
    options: RedisOptions
    context?: PergelGlobalContextOmitModule
  },
) {
  const context = params.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel BullMQ is not defined')

  const { selectData } = await globalContext({
    projectName: context.projectName,
    moduleName: 'bullmq',
  }, ({ bullmq }) => {
    if (!bullmq?.url && (!bullmq?.options || !bullmq?.options.host || bullmq?.options.port === 0))
      throw new Error('No BullMQ found in environment variables.')

    if (bullmq?.url) {
      return {
        bullmq: {
          client: new Redis(bullmq.url, {
            maxRetriesPerRequest: null,
          }),
        },
      }
    }

    if (!selectData?.bullmq?.client?.options)
      throw new Error('No BullMQ found in environment variables.')

    return {
      bullmq: {
        client: new Redis({
          host: selectData.bullmq.client.options.host || 'localhost',
          port: selectData.bullmq.client.options.port || 6379,
          password: selectData.bullmq.client.options.password || undefined,
          username: selectData.bullmq.client.options.username || undefined,
          db: selectData.bullmq.client.options.db || 0,
          maxRetriesPerRequest: null,
          ...params.options,
        }),
      },
    }
  })

  if (!selectData?.bullmq?.client)
    throw new Error('No BullMQ found in environment variables.')

  return selectData.bullmq.client
}
