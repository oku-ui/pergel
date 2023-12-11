export default defineEventHandler(async () => {
  const { listAllObjects } = await pergelTest().S3().useS3()

  // uploadObject({
  //   Key: 'tes2t.txt',
  //   Body: 'Hello world',
  // })
  const listAll = await listAllObjects()

  return listAll
})
