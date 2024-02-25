# Use


## defineEventHandler

1. Example of a `GET` request to the `user` table
<!-- automd:file code src="../../../../examples/p-drizzle/server/api/test.ts" -->

```ts [test.ts]
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

```

<!-- /automd -->

2. Example of a `POST` request to the `user` table

<!-- automd:file code src="../../../../examples/p-drizzle/server/api/user.post.ts" -->

```ts [user.post.ts]
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const db = await pergelChangeName()
    .drizzle()
    .postgresjs()
    .connect({
      event,
    })

  const result = await db
    .insert(changeNameTables.user)
    .values({
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: body.username,
    })
    .returning()

  return {
    statusCode: 200,
    body: result,
  }
})

```

<!-- /automd -->