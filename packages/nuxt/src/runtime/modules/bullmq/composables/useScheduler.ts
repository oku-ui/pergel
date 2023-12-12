import { consola } from 'consola'
import pTimeout from 'p-timeout'

import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import { redisConnections, useRedis } from './useRedis'
import type { PergelGlobalContextOmitModule } from '#pergel'

export type Scheduler = ReturnType<typeof useScheduler>

let myQueue: Queue | null
let stopped = false

export function useScheduler(
  this: PergelGlobalContextOmitModule,
  config: {
    queueName: string
    prefix?: string
  },
  pergel?: PergelGlobalContextOmitModule,
) {
  const _pergel: PergelGlobalContextOmitModule = pergel || this

  if (!_pergel)
    throw new Error('Pergel not found')

  let redisConnection = redisConnections.get(_pergel.projectName)?.client || null

  function onErrorDefault(source: string) {
    return (error: Error) => {
      console.error(`onError called from source ${source}`, error)
    }
  }

  function onFailedDefault(job: any | undefined, error: Error) {
    console.error(
      `Job %s failed after %s attempts, reason: %s`,
      job?.name,
      job?.attemptsMade,
      job?.failedReason,
    )
    console.error(error)
  }

  async function initQueueAndWorkers(
    callback: (job: Job<any, any, string>) => Promise<void>,
    onError?: (source: string, error: Error) => void,
    onFailed?: (job: any | undefined, error: Error) => void,
    onCompleted?: (job: any) => void,
  ) {
    if (!redisConnection)
      return false

    myQueue = new Queue(config.queueName, {
      prefix: config.prefix || 'pergel',
      connection: redisConnection,
    })

    // Wait for Queues to be ready
    await myQueue.waitUntilReady()

    // New Worker
    const worker = new Worker(
      config.queueName,
      async (job) => {
        await callback(job)
      },
      {
        prefix: config.prefix || 'pergel',
        connection: redisConnection,
      },
    )

    worker.on('error', (error) => {
      onError ? onError(`${config.queueName}Worker`, error) : onErrorDefault(`${config.queueName}Worker`)(error)
    })

    worker.on('failed', (job, error) => {
      onFailed ? onFailed(job, error) : onFailedDefault(job, error)
    })

    worker.on('completed', (job) => {
      // TODO: kullanici loglari kapatabilmeli.
      onCompleted ? onCompleted(job) : consola.info(`${job.id} has completed!`)
    })

    // Wait for Workers
    await worker.waitUntilReady()

    consola.info('BullMQ started')
  }

  async function start(
    initQueueCallback: Parameters<typeof initQueueAndWorkers>[0],
    onError?: Parameters<typeof initQueueAndWorkers>[1],
    onFailed?: Parameters<typeof initQueueAndWorkers>[2],
    onCompleted?: Parameters<typeof initQueueAndWorkers>[3],
  ) {
    const client = await useRedis({
      retryStrategy(times: any) {
        return Math.min(times * 500, 2000)
      },
      reconnectOnError(error: any) {
        onError ? onError('redis:reconnectOnError', error) : onErrorDefault('redis:reconnectOnError')(error)
        if (error.message)
          return false

        return 1
      },
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    }, _pergel)

    if (client && !redisConnection)
      redisConnection = client

    client.on('error', (err: any) => {
      onError ? onError('redis:error', err) : onErrorDefault('redis:error')(err)
    })

    client.on('connect', () => {
      consola.info('Redis connection established')
    })

    client.on('ready', async () => {
      consola.info('Redis connection ready... creating queues and workers...')
      await initQueueAndWorkers(initQueueCallback, onError, onFailed, onCompleted)
    })

    client.on('close', () => {
      consola.info('Redis connection closed')
    })

    client.on('reconnecting', (timeToReconnect?: number) => {
      consola.info('Redis reconnecting in %s', timeToReconnect)
    })

    client.on('end', async () => {
      consola.info('Redis ended - no more reconnections will be made')
      await stop()
    })
  }

  async function stop() {
    consola.log('Started Usage shutdown...')
    stopped = true

    consola.log('Clearing BullMQ...')
    try {
      if (myQueue) {
        myQueue.removeAllListeners()
        await pTimeout(myQueue.close(), {
          milliseconds: 5000,
          message: 'BullMQ close timeout',
        })
      }
    }
    catch (e) {
      consola.error('Failed to stop queues', e)
    }
    finally {
      myQueue = null
      consola.info('BullMQ stopped')
    }

    if (redisConnection) {
      consola.info('Stopping Redis...')

      try {
        redisConnection.disconnect(false)
      }
      catch (e) {
        consola.error('Failed to stop Redis connection', e)
      }
      finally {
        redisConnection = null
        myQueue = null
        consola.info('Redis stopped')
      }
    }

    consola.info('Exiting')
    process.exit(0)
  }

  async function schedule(...data: Parameters<Queue['add']>) {
    if (!myQueue)
      throw new Error('Queue not initialized')

    // Add: name, data, opts
    consola.info('Adding job to queue %s', config.queueName)
    return myQueue.add(...data)
  }

  return {
    schedule,
    start,
    stop,
    readiness() {
      if (stopped)
        return false

      return myQueue !== null && redisConnection?.status === 'ready'
    },
  }
}
