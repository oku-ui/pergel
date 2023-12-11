export default defineEventHandler(async () => {
  const { uploadObject, listAllObjects } = await pergelTest().S3().useS3()

  const name = Math.random().toString(36).substring(7)

  uploadObject({
    Key: `${name}.txt`,
    Body: Math.random().toString(36).substring(7),
  })
  const listAll = await listAllObjects()

  return listAll
})
