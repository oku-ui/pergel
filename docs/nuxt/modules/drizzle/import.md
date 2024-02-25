---
outline: deep
---

# Auto Imports and Aliases

`changeName` is the name of your project. Please change it to your project name.

## Auto Imports functions

### `pergelChangeName().drizzle() ...`

```ts twoslash [server/api/getUsers.ts]
export default defineEventHandler(async (event) => {
  const connect = await pergelChangeName()
  .drizzle()
  .postgresjs()
  .connect({
    event,
  })
  const result = await connect.select().from(changeNameTables.user)
  return {
    statusCode: 200,
    body: result,
  }
})
```

### `changeNameTables` 

This is the table schema. It is automatically generated from the database schema. `server/drizzle-changeName/index.ts` is automatically added to the server.

```ts twoslash [server/utils/test.ts]
// @noErrors
const table = changeNameTables.
//                             ^|
```

&nbsp;

&nbsp;

&nbsp;

### `changeNameDrizzleStorage`

`server/drizzle-changeName/index.ts` is automatically added to the server.

Storage is automatically added to the server.

```ts twoslash [server/api/getUsers.ts]
export default defineEventHandler(async (event) => {
  const db = await pergelChangeName()
  .drizzle()
  .postgresjs()
  .connect({
    event,
  })

  const store = changeNameDrizzleStorage({
    db
  })

  return {
    statusCode: 200,
  }
})
```


## Aliases

- `#changeName/server/drizzle`
- `#changeName/server/drizzle/storage`
- `#changeName/server/drizzle/schema`