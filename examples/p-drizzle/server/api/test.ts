export default defineEventHandler(async () => {
  const connect = changeNameDbConnect()

  const result = await connect
    .select()
    .from(changeNameTables.user)

  return {
    statusCode: 200,
    body: result,
  }
})
