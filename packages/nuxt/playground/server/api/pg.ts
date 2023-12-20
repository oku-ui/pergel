export default defineEventHandler(async () => {
  const connect = await pergelTest().drizzle().postgresjs().connect({})
  const result = await connect.execute(sql`SELECT * FROM users`)

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
})
