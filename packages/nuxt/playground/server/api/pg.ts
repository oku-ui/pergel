export default defineEventHandler(async (event) => {
  const connect = await pergelTest().drizzle().postgresjs().connect({
    event,
  })
  const result = await connect.select().from(testTables.user)
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
})
