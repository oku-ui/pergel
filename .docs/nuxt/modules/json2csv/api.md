---
outline: deep
---

# API

### `pergelChangeName().json2csv()`

```ts twoslash [server/example.ts]
async function test() {
// @noErrors
  const json = await pergelChangeName().json2csv().
//                                                 ^|
}
```


### `pergelChangeName().json2csv().use()`

```ts twoslash [server/example.ts]
async function test() {
  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })
      
// @noErrors
  const data = json.
//                  ^|
}
```

### `csv`

- Type: `string`

Returns the CSV string.

- Type: `string`

```ts twoslash [server/example.ts]
async function test() {
  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })

  const data = json.csv
}
```

### `setResponseCsv`

Returns the HTTP response with the CSV string.

- Type: `string`

```ts twoslash [server/example.ts]
async function test() {
  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })

  const data = json.csv

  setResponseCsv(data)
}
```

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->