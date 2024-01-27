import { consola } from 'consola'
import pTimeout from 'p-timeout'
import type { NitroApp } from 'nitropack'

import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import type { H3Event } from 'h3'

import { getPergelContextProject } from '../../../../server/utils/getPergelContextProject'
import { useBullMQRedisClient } from './useBullMQRedisClient'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export type Scheduler<T extends object> = ReturnType<typeof useScheduler<T>>

// Project Name, Queue
const _myQueue = new Map<string, Queue>()
const _stopped = new Map<string, boolean>()

/**
 * @credit https://github.com/kamilkisiela/graphql-hive/blob/main/packages/services/emails/src/scheduler.ts
 */
export function useScheduler<T extends object>(
  this: PergelGlobalContextOmitModule & {
    nitro?: NitroApp
  },
  params: {
    pergel?: PergelGlobalContextOmitModule
    /**
     * If server/plugin in used, event false
     */
    event: H3Event | false
  },
) {
  const _pergel: PergelGlobalContextOmitModule = params.pergel || this

  if (!_pergel)
    throw new Error('Pergel not found')

  let redisConnection = params.event
    ? getPergelContextProject.call({
      moduleName: 'bullmq',
      projectName: _pergel.projectName,
    }, {
      event: params.event,
    })?.bullmq?.client || null
    : null

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
    data: {
      config: {
        queueName: T extends { queueName: infer Q } ? Q : string
        prefix?: string
      }
      jobMethod: (job: Job<any, any, string>) => Promise<void>
      onError?: (source: string, error: Error) => void
      onFailed?: (job: any | undefined, error: Error) => void
      onCompleted?: (job: any) => void
    },
  ) {
    const { jobMethod, config, onCompleted, onError, onFailed } = data
    if (!redisConnection)
      return false

    _myQueue.set(_pergel.projectName, new Queue(config.queueName, {
      prefix: config.prefix || 'pergel',
      connection: redisConnection,
    }))
    const myQueue = _myQueue.get(_pergel.projectName)

    // Wait for Queues to be ready
    await myQueue?.waitUntilReady()

    // New Worker
    const worker = new Worker(
      config.queueName,
      async (job) => {
        await jobMethod(job)
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
    ...args: Parameters<typeof initQueueAndWorkers>
  ) {
    const { config, jobMethod, onError, onFailed, onCompleted } = args[0]
    const client = await useBullMQRedisClient.call(_pergel, {
      options: {
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
      },
      event: false,
    })

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
      await initQueueAndWorkers({
        config,
        jobMethod,
        onError,
        onFailed,
        onCompleted,
      })
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
    const myQueue = _myQueue.get(_pergel.projectName)

    consola.log('Started Usage shutdown...')
    _stopped.set(_pergel.projectName, true)

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
      _myQueue.delete(_pergel.projectName)
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
        _myQueue.delete(_pergel.projectName)
        consola.info('Redis stopped')
      }
    }

    consola.info('Exiting')
  }

  async function schedule(...data: Parameters<Queue<any, any, T extends { queueName: infer Q } ? Q : string>['add']>) {
    const name = data[0]
    const myQueue = _myQueue.get(_pergel.projectName)
    if (!myQueue)
      throw new Error('Queue not initialized')

    // Add: name, data, opts
    consola.info('Adding job to queue %s', name)
    return myQueue.add(...data)
  }

  if (this.nitro) {
    this.nitro.hooks.hook('close', () => {
      console.warn('Redis connection closed')
      stop()
    })
  }

  return {
    schedule,
    start,
    stop,
    readiness() {
      const myQueue = _myQueue.get(_pergel.projectName)
      const stopped = _stopped.get(_pergel.projectName)

      if (stopped)
        return false

      return myQueue !== null && redisConnection?.status === 'ready'
    },
  }
}
