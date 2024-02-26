---
outline: deep
---

# API

### `pergelChangeName().json2csv()`

```ts twoslash [server]
// @noErrors
  const json = await pergelChangeName()
      .json2csv().
//                ^|
```


### `pergelChangeName().json2csv().use()`

```ts twoslash [server]

  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })
// @noErrors
  const data = json.
//                  ^|
```

### `csv`

- Type: `string`

Returns the CSV string.

- Type: `string`

```ts twoslash [server]
  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })

  const data = json.csv
```

### `setResponseCsv`

Returns the HTTP response with the CSV string.

- Type: `string`

```ts twoslash [server]
  const json = await pergelChangeName()
      .json2csv()
      .use({
        data: {},
        opts: {}
      })

  const data = json.csv

  return setResponseCsv(data)
```

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->