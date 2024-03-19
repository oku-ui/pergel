addEventListener('testSave', async (resolve, reject) => {
  try {
    CapacitorKV.set('foo', 'my bar')

    resolve()
  }
  catch (err) {
    console.error(err)
    reject(err)
  }
})

addEventListener('testLoad', async (resolve, reject) => {
  try {
    const value = CapacitorKV.get('foo')

    console.log(value, 'BackgroundRunner KV Value')

    resolve(value)
  }
  catch (err) {
    console.error(err)
    reject(err)
  }
})
