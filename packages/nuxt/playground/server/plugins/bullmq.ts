import type { Job } from 'bullmq'

export default pergelTest().bullmq().nitroPlugin({
  setup: ({ useScheduler }) => {
    const { start } = useScheduler()

    const isStarted = start({
      config: {
        queueName: 'email',
      },
      jobMethod: consumeMethod,
    })

    if (!isStarted)
      console.warn('Redis connection not started')
  },
})

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
