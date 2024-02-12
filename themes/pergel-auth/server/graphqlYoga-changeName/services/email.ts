import consola from 'consola'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'auth',
})

async function verificationEmail(this: API, params: {
  email: string
}) {
  const { sendEmail, templates } = await pergelChangeName().ses().use({
    event: this.context.event,
  })

  const generatedCode = nanoidNanoid()

  const result = await sendEmail(templates().verificationEmail({
    toAddresses: [params.email],
    code: generatedCode,
    projectName: 'Pergel',
    source: 'noreply@productdevbook.com',
    clickButtonUrl: `https://oku-ui.com/verify-email?code=${generatedCode}`,
    helpEmailAddress: 'help@oku-ui.com',
  }))

  return result
}

export function email(input: API) {
  return {
    verificationEmail: verificationEmail.bind(input),
    logger,
  }
}
