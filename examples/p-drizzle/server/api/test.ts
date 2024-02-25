export default defineEventHandler(async (event) => {
  const connect = await pergelChangeName()
    .drizzle()
    .postgresjs()
    .connect({
      event,
    })

  const result = await connect
    .select()
    .from(changeNameTables.user)

  return {
    statusCode: 200,
    body: result,
  }
})
