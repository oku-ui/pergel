const datas = [
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

export default defineEventHandler(async (_event) => {
  // console.warn(event.context.user)
  try {
    const { csv } = await pergelTest().json2csv().use({
      data: datas,
    })

    return csv
  }
  catch (error: any) {
    return error.message
  }
})
