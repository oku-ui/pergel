import { CreateTemplateCommand, type CreateTemplateCommandInput, SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import type { H3Event } from 'h3'
import type { SesModuleRuntimeConfig } from '../types'
import { templates } from '../templates'
import { clientFunctionTemplate } from '../../../../runtime/core/useClient'
import type { PergelGlobalContextOmitModule } from '#pergel'

export interface Credentials {
  accessKeyId: string
  secretAccessKey: string
}

const { clientInit } = clientFunctionTemplate<SESClient, SesModuleRuntimeConfig>('ses')

export async function useSes(
  this: PergelGlobalContextOmitModule,
  event?: H3Event,
  data?: PergelGlobalContextOmitModule,
) {
  const _pergel = data ?? this

  if (!_pergel || !_pergel.projectName)
    throw new Error('Pergel is not defined')

  const { client } = await clientInit(_pergel, (runtime) => {
    return new SESClient({
      region: runtime.region,
      credentials: {
        accessKeyId: runtime.accessKeyId,
        secretAccessKey: runtime.secretAccessKey,
      },
    })
  }, event)

  async function sendEmail(params: SendEmailCommandInput) {
    const command = new SendEmailCommand(params)
    const data = await client.send(command)
    return data
  }

  async function createTemplate(params: CreateTemplateCommandInput) {
    const command = new CreateTemplateCommand(params)
    const data = await client.send(command)
    return data
  }

  return {
    sendEmail,
    createTemplate,
    templates,
    client,
  }
}
