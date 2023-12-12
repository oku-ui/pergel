import type { Job } from 'bullmq'

export default pergelTest().bullmq().definePergelNitroBullMQPlugin({
  setup: ({ useScheduler }, nitro) => {
    const { start, stop } = useScheduler('email')

    nitro.hooks.hook('close', () => {
      console.warn('Redis connection closed')
      stop()
    })

    const isStarted = start(
      consumeMethod,
    )

    if (!isStarted)
      console.warn('Redis connection not started')
  },
})

// Send Email
async function consumeMethod(job: Job<any, any, string>) {
  console.warn('Coming data', job.data)
  const result = await sleep(3000)
  console.warn(result)
}

// Sleep
function sleep(time: number) {
  return new Promise((resolve) => {
    console.warn('Process started')
    setTimeout(() => {
      resolve('Process finished')
    }, time)
  })
}

// Option 1
/* const { schedule, start, stop } = pergelProject2().bullmq().useScheduler({
  queueName: 'email',
}) */

// Option 2
