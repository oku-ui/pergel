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
