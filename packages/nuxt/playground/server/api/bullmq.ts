export default defineEventHandler(async () => {
  const ID = Math.random().toString(36).substring(7) // generate random id

  const { schedule } = pergelTest().bullmq().useScheduler({
    queueName: 'email',
  })

  if (schedule === null)
    return 'Redis not started'

  const QUEUE_NAME = 'email'

  schedule(QUEUE_NAME, {
    id: ID,
    name: '1020',
    data: {
      email: 'test',
      body: 'Welcome to our website',
    },
    options: {
      delay: 1000,
      attempts: 3,
    },
  }, {
    jobId: ID,
    removeOnComplete: {
      age: 30,
    },
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  })

  return 'Hello BullMQ'
})
