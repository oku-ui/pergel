import type { H3Event } from 'h3'
import {
  S3Client,
} from '@aws-sdk/client-s3'

import { usePergelContext } from '../../../server/utils/usePergelContext'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export function s3Client(
  this: PergelGlobalContextOmitModule,
  params: {
    pergel?: PergelGlobalContextOmitModule
    event?: H3Event
  },
) {
  const context = params.pergel || this

  if (!context || !context.projectName)
    throw new Error('Pergel is not defined')

  const { selectData, runtime } = usePergelContext<'s3'>({
    moduleName: 'S3',
    projectName: context.projectName,
  }, (runtime) => {
    if (!runtime)
      throw new Error('S3 is not defined')

    return {
      s3: {
        client: new S3Client({
          region: runtime.region,
          endpoint: runtime.endpoint,
          credentials: {
            accessKeyId: runtime.accessKeyId,
            secretAccessKey: runtime.secretAccessKey,
          },
        }),
      },
    }
  }, params.event)

  if (!selectData?.s3?.client || !runtime)
    throw new Error('S3 is not defined')

  return selectData.s3.client
}
