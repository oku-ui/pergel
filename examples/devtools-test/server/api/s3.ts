export default defineEventHandler(async () => {
  const { client: _ } = await pergelTest().S3().useS3()
  return {
    hello: 'world',
  }
})
