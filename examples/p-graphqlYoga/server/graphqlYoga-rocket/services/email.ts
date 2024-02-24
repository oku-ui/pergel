import consola from 'consola'
import type { API } from './types'

const logger = consola.withDefaults({
  tag: 'email',
})

async function verificationEmail(this: API, params: {
  email: string
}) {
  const { sendEmail, templates } = await pergelRocket().ses().use({
    event: this.context.event,
  })

  const generatedCode = nanoidNanoid()

  const result = await sendEmail(templates().verificationEmail({
    toAddresses: [params.email],
    code: generatedCode,
    projectName: 'Pergel',
    source: 'noreply@huntersofbook.com',
    clickButtonUrl: `https://oku-ui.com/verify-email?code=${generatedCode}`,
    helpEmailAddress: 'help@huntersofbook.com',
  }))

  if (result?.$metadata.httpStatusCode !== 200)
    logger.error('Failed to send verification email', result)

  return result
}

export function email(input: API) {
  return {
    verificationEmail: verificationEmail.bind(input),
    logger,
  }
}
