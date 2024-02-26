# API

### `pergelChangeName().json2csv()`

```ts twoslash [server/example.ts]
async function test() {
const obj = await pergelChangeName().json2csv()
}
```


### `pergelChangeName().json2csv().use()`

```ts twoslash [server/example.ts]
async function test() {
  const hello = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {},
      })

// @noErrors 
const data = hello.
//                 ^|
}

}
```

### `csv`

- Type: `string`

Returns the CSV string.

- Type: `string`

### `setResponseCsv`

Returns the HTTP response with the CSV string.

- Type: `string`

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->