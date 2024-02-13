import type { Buffer } from 'node:buffer'

export default defineEventHandler(async (event) => {
  const file = await readMultipartFormData(event)

  const _file = file?.[0] as {
    filename: string
    data: Buffer
  }
  const { uploadObject } = pergelRocket().S3().use({ event })

  await uploadObject({
    Key: _file.filename,
    Body: _file.data,
  })

  return {
    hello: 'world',
  }
})
