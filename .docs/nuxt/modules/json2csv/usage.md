# Use

## defineEventHandler

1. Returns a `csv` string from the `exampleData` array.
<!-- automd:file code src="../../../../examples/p-json2csv/server/api/getcsv.ts" -->

```ts [getcsv.ts]
const exampleData = [
  {
    car: 'Audi',
    price: 40000,
    color: 'blue',
  },
  {
    car: 'BMW',
    price: 35000,
    color: 'black',
  },
  {
    car: 'Porsche',
    price: 6000,
    color: 'green',
  },
]

export default defineEventHandler(async () => {
  try {
    const { csv } = await pergelChangeName()
      .json2csv()
      .use({
        data: exampleData,
      })

    return csv
  }
  catch (error: any) {
    return error.message
  }
})

```

<!-- /automd -->

2. Returns the HTTP response `Content-Disposition` with the `attachment` value and the `filename` value as `csv-[timestamp].csv`.

<!-- automd:file code src="../../../../examples/p-json2csv/server/api/csvDownload.ts" -->

```ts [csvDownload.ts]
const exampleData = [
  {
    car: 'Audi',
    price: 40000,
    color: 'blue',
  },
  {
    car: 'BMW',
    price: 35000,
    color: 'black',
  },
  {
    car: 'Porsche',
    price: 6000,
    color: 'green',
  },
]

export default defineEventHandler(async (event) => {
  try {
    const { setResponseCsv } = await pergelChangeName()
      .json2csv()
      .use({
        data: exampleData,
      })

    await setResponseCsv({
      event,
      csv: true,
    })
  }
  catch (error: any) {
    return error.message
  }
})

```

<!-- /automd -->

<!-- automd:changeName -->

::: tip changeName
`changeName` is the name of your project. Please change it to your project name.
:::

<!-- /automd -->