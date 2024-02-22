declare module '#test/server/bullmq/types' {
  export interface TestBullmqContext {
    queueName: 'default' | 'email'
  }
}
