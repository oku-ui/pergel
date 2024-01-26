import { CreateTemplateCommand, type CreateTemplateCommandInput, SESClient, SendEmailCommand, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import type { H3Event } from 'h3'
import { templates } from '../templates'
import { usePergelContext } from '../../../server/utils/usePergelContext'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export interface Credentials {
  accessKeyId: string
  secretAccessKey: string
}

export async function usePergelSES(
  this: PergelGlobalContextOmitModule,
  params: {
    event: H3Event | false
    context?: PergelGlobalContextOmitModule
  },
) {
  const context = params?.context ?? this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData } = await usePergelContext<'ses'>({
    moduleName: 'ses',
    projectName: context.projectName,
  }, (runtime) => {
    if (!runtime?.region)
      throw new Error('SES is not defined')

    return {
      ses: {
        client: new SESClient({
          region: runtime.region,
          credentials: {
            accessKeyId: runtime.accessKeyId,
            secretAccessKey: runtime.secretAccessKey,
          },
        }),
      },
    }
  }, params.event)

  if (!selectData?.ses?.client)
    throw new Error('SES is not defined')

  async function sendEmail(params: SendEmailCommandInput) {
    const command = new SendEmailCommand(params)
    const data = await selectData?.s3?.client?.send(command)
    return data
  }

  async function createTemplate(params: CreateTemplateCommandInput) {
    const command = new CreateTemplateCommand(params)
    const data = await selectData?.s3?.client?.send(command)
    return data
  }

  return {
    sendEmail,
    createTemplate,
    templates,
    client: selectData.ses.client,
  }
}
