export default defineEventHandler(async (event) => {
  try {
    const { sendEmail, templates } = await pergelRocket().ses().use({
      event,
    })

    const _emailParams = {
      Destination: {
        ToAddresses: ['hi@productdevbook.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: 'Test email',
          },
        },
        Subject: {
          Data: 'Test email',
        },
      },
      Source: 'noreply@productdevbook.com',
    }

    // const sendtest = await sendEmail(_emailParams)

    const result = await sendEmail(templates().changeEmail({
      to: 'hi@productdevbook.com',
      code: '123456',
      webUrl: 'https://productdevbook.com',
      source: 'noreply@productdevbook.com',
    }))

    return {
      data: {
        mailResult: result,
      },
    }
  }
  catch (error: any) {
    return error.message
  }
})
