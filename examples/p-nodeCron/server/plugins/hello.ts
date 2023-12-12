export default pergelRocket().nodeCron().nitro().plugins().init({
  setup: async (_cron) => {
    // cron.every.seconds(3, () => {
    //   console.warn('running a task every 3 seconds')
    // })
    // cron.every.minutes(5, () => {
    //   console.warn('running a task every 5 minutes')
    // })
    // cron.every.thirtyMinutes(() => {
    //   console.warn('running a task every 30 minutes')
    // })
    // cron.schedule('*/5 * * * * *', () => {
    //   console.warn('running a task every 5 seconds')
    // })
  },
  onError: async (error: any) => {
    console.warn(error.message)
  },
})
