export default defineEventHandler(async () => {
  const connect = await pergelTest().drizzle().postgresjs().connect({})
  const result = await connect.select().from(tablesTest.user)
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
})
