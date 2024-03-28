export default defineEventHandler(async () => {
  const connect = await changeNameDbConnect()

  const result = connect
    .select()
    .from(changeNameTables.user)

  return {
    statusCode: 200,
    body: result,
  }
})
