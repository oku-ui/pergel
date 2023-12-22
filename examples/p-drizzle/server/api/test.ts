export default defineEventHandler(async () => {
  const connect = await pergelRocket().drizzle().postgresjs().connect({})
  const result = await connect.select().from(tablesRocket.user)
  return {
    statusCode: 200,
    body: result,
  }
})
