import { Redis } from 'ioredis'
import type { RedisOptions } from 'ioredis'

import type { BullMQModuleRuntimeConfig } from '../../types'
import { clientFunctionTemplate } from '../../../../core/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

const { clientInit, mapValue } = clientFunctionTemplate<Redis, BullMQModuleRuntimeConfig>('bullmq')

export const redisConnections = mapValue

export async function useRedis(
  options: RedisOptions = {},
  ctx: PergelGlobalContextOmitModule,
) {
  const { client } = await clientInit(ctx, (runtime) => {
    if (!runtime.url && (!runtime.options || !runtime.options.host || runtime.options.port === 0))
      throw new Error('No BullMQ found in environment variables.')

    if (runtime.url)
      return new Redis(runtime.url)

    if (!runtime.options)
      throw new Error('No BullMQ found in environment variables.')
    return new Redis({
      host: runtime.options?.host || 'localhost',
      port: runtime.options?.port || 6379,
      password: runtime.options?.password || undefined,
      username: runtime.options?.username || undefined,
      db: runtime.options?.db || 0,
      ...options,
    })
  })

  return client
}
